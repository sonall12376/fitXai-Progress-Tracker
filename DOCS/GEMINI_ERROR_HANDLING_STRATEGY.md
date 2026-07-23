# FitAI-X: Progress Tracker — Gemini Error Handling Strategy
## Senior Backend Engineer System Specification

This document details the production-ready error handling, logging, retry, and monitoring strategies for the Google Gemini API integration within the FitAI-X backend. It defines how the system maintains stability, logs diagnostic data, and prevents upstream failures from degrading the user experience.

---

### 1. Taxonomy of Integration Errors

To handle exceptions effectively, we classify potential integration failures into three primary categories:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                              Error Category                            │
└──────────────┬──────────────────────┬──────────────────────┬───────────┘
               │                      │                      │
               ▼                      ▼                      ▼
       [Upstream AI Errors]   [Data Parsing Errors]   [Infrastructure Errors]
       - Invalid API Key      - Malformed JSON        - PostgreSQL Offline
       - Gemini API Timeout   - Unexpected Response   - System Memory Outage
       - Rate Limits (429)    - Empty Response        - Express Crashes
       - Socket Hangups       - Missing JSON Fields
```

---

### 2. Specific Error Handling Guidelines

#### Upstream AI Errors

##### 1. Invalid API Key (HTTP 401 / 403)
*   **Root Cause**: Incorrect, expired, or deactivated `GEMINI_API_KEY`.
*   **Handling Strategy**:
    *   The backend intercepts `401 Unauthorized` or `403 Forbidden` status codes from the Gemini SDK client.
    *   It immediately **halts all retry attempts** to avoid wasting resources or triggering account lockouts.
    *   It triggers a critical system log and fires an immediate developer alert.
    *   The `ErrorHandler` compiles a safe local default analysis, and the controller returns it to the client with a success envelope containing a warning flag.

##### 2. Gemini Timeout (Latency > 8 Seconds)
*   **Root Cause**: Network congestion or model overload on Google's servers.
*   **Handling Strategy**:
    *   The `GeminiClient` attaches an `AbortSignal` with a strict `8000ms` timeout to all requests.
    *   If the request times out, the client aborts the connection and throws a `GeminiTimeoutException`.
    *   The module logs a warning containing the correlation ID, skips further retries, and returns the local database-derived fallback report.

##### 3. Rate Limit (HTTP 429 / RESOURCE_EXHAUSTED)
*   **Root Cause**: Exceeding model request limits or token-per-minute (TPM) quotas.
*   **Handling Strategy**:
    *   The system intercepts `429 Too Many Requests`.
    *   It invokes the **Retry Mechanism** using Exponential Backoff with Jitter (see Section 3).
    *   If all 3 retries fail, it falls back to the database-derived report.

##### 4. Network Failure (DNS Drops, Socket Hangups, TCP/IP Errors)
*   **Root Cause**: Local server network disconnects or upstream gateway resets.
*   **Handling Strategy**:
    *   The system catches socket errors (e.g. `ECONNRESET`, `ENOTFOUND`, `ETIMEDOUT`).
    *   It attempts retries using the backoff algorithm.
    *   If retries fail, it falls back to the database-derived report.

---

#### Data Parsing & Model Compliance Errors

##### 5. Malformed JSON (Parsing Syntax Errors)
*   **Root Cause**: Gemini returns invalid JSON formatting, such as missing brackets, unescaped characters, or trailing commas.
*   **Handling Strategy**:
    *   The `ResponseParser` attempts to extract the JSON payload.
    *   If `JSON.parse()` fails, the system logs the raw string response for debugging.
    *   It attempts a one-time automatic retry with the same prompt. If the second attempt fails, it defaults to the local fallback report.

##### 6. Unexpected AI Response (Type/Enum Mismatch)
*   **Root Cause**: Gemini returns the correct JSON keys but incorrect values or data types (e.g., returning `"high"` instead of `"High"`, or `"N/A"` instead of `null`).
*   **Handling Strategy**:
    *   The `SchemaValidator` processes the parsed object.
    *   It applies correction rules, such as converting string cases, clamping out-of-bounds numbers, and mapping unrecognized values to default enums.
    *   If a critical field cannot be corrected, it triggers the fallback engine.

##### 7. Empty Response (Null/Empty String)
*   **Root Cause**: Safety filters block the output, or the model fails silently.
*   **Handling Strategy**:
    *   The client checks for null or whitespace-only strings.
    *   If detected, it throws an `EmptyAIResponseException` and routes the request to the fallback engine.

##### 8. Missing Required Fields
*   **Root Cause**: The model skips generating specific keys defined in the schema.
*   **Handling Strategy**:
    *   The `SchemaValidator` evaluates the fields against required schemas.
    *   If non-critical keys (such as `userVulnerabilities` or `motivationMessage`) are missing, it dynamically injects default values (e.g. empty lists or generic templates) rather than throwing an exception.
    *   If critical keys (like `progressScore` or `injuryRisk`) are missing, it triggers the fallback engine.

---

#### Infrastructure & Host Errors

##### 9. Database Failure (PostgreSQL Offline/Transaction Errors)
*   **Root Cause**: PostgreSQL is offline, database connections pool is exhausted, or disk space is full.
*   **Handling Strategy**:
    *   The AI Integration module is kept completely independent of the database connection state.
    *   If a database transaction fails while saving the daily log or AI report:
        *   The backend logs a critical DB error.
        *   It still executes the Gemini API request using the inputs provided in the HTTP request payload.
        *   It returns the generated report directly to the user's browser, noting that while the AI analysis was successful, the log could not be saved to their history.

##### 10. Backend Failure (Process Out of Memory, Crashes, Uncaught Exceptions)
*   **Root Cause**: System memory leaks or unhandled runtime exceptions.
*   **Handling Strategy**:
    *   The backend process manager (such as PM2) monitors process health and automatically restarts crashed instances in under 500ms.
    *   Global handlers (such as `process.on('uncaughtException')` and `process.on('unhandledRejection')`) capture unhandled errors, log details, and execute clean process shutdowns.

---

### 3. Retry Mechanism with Exponential Backoff and Jitter

To prevent overloading upstream APIs during recovery, the module implements **Exponential Backoff with Jitter**:

1.  **Backoff Calculation**:
    The delay before each retry attempt increases exponentially:
    $$\text{Base Delay} = 1000 \text{ms} \times 2^{\text{attempt}}$$
2.  **Adding Jitter (Randomization)**:
    To prevent multiple concurrent backend requests from hitting the Gemini API at the same time, the system adds random milliseconds of "jitter":
    $$\text{Final Delay} = \text{Base Delay} + \text{Random}(0, 500\text{ms})$$
3.  **Attempt Limits**:
    *   *Maximum Retries*: `3`.
    *   *Delay Sequence*: Attempt 1 $\approx$ 2.0s, Attempt 2 $\approx$ 4.2s, Attempt 3 $\approx$ 8.5s.
4.  **Immediate Bypasses**: Bypasses the retry loop immediately for non-transient errors (such as `401 Unauthorized` or schema errors).

---

### 4. Dynamic Fallback Generation Pipeline

If the AI module fails to generate a report, the `ErrorHandler` compiles a safe, pre-structured fallback report from database stats:

1.  **Metric Calculation**:
    *   It queries PostgreSQL for the user's log history.
    *   It calculates average sleep duration, average water intake, and total workout completion rates for the past week.
2.  **Fallback JSON Construction**:
    *   Sets `progressScore` using a basic rule-based calculator.
    *   Sets `workoutPerformance.feedback` to: *"AI Analysis is temporarily offline. Displaying logged values only."*
    *   Sets `injuryRisk.riskLevel` to `"Moderate"` if the user reported pain, otherwise `"Low"`.
    *   Sets `personalizedRecommendations` to standard guidelines (e.g. drinking 2.5L water, aiming for 8 hours of sleep).
3.  **Client Return**: The controller returns the fallback payload with a status flag, ensuring the user's dashboard renders correctly.

---

### 5. Logging Strategy

Structured logging is essential for diagnosing errors in production. The module follows these logging guidelines:

*   **Correlation IDs**: Every request is assigned a unique `correlationId` (UUID v4) at the API gateway boundary. This ID is attached to all logs, database records, and API payloads, allowing developers to trace request lifecycles.
*   **Log Levels**:
    *   `INFO`: Startup checks, cache hits, completed reports, and token usages.
    *   `WARN`: Gemini timeouts, rate limits (429), and schema correction modifications.
    *   `ERROR`: Database failures, unparseable JSON structures, and connection exceptions.
*   **PII Filtering (Data Privacy)**: The logging utility automatically redacts sensitive user details (such as names, weights, and custom workout notes) from debug messages before writing logs to disk, ensuring user privacy.
*   **Log Rotation**: Log files are rotated daily (using libraries like `winston-daily-rotate-file`) and archived after 14 days to prevent disk space exhaustion.

---

### 6. Monitoring & Alerting Strategy

We monitor the health of the AI module using the following key performance indicators (KPIs):

1.  **p95 & p99 Latency**: Tracks the time taken to generate AI reports. If p95 latency exceeds **5 seconds**, it triggers a performance warning.
2.  **AI Success-to-Fallback Ratio**: Measures the proportion of requests that fall back to database-derived reports. If this ratio drops below **98%** in any 10-minute window, it triggers a system alert.
3.  **Rate Limit Occurrences**: Monitors the frequency of HTTP 429 errors.
4.  **Alerting Channels**:
    *   *Warning Alerts* (e.g. latency warnings) are sent to a dedicated developers' Slack channel.
    *   *Critical Alerts* (e.g. invalid API key, database down, or fallback rates > 5%) are sent directly to on-call engineers via paging tools (such as PagerDuty or Opsgenie).
