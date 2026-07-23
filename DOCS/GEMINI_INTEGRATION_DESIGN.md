# FitAI-X: Progress Tracker — Gemini Integration Design Document
## Senior AI Engineer System Specification

This document details the software design, integration patterns, and operational protocols for connecting the FitAI-X Node.js + TypeScript backend with the Google Gemini API. It serves as the master guide for developers implementing the AI integration layer.

---

### 1. API Key Storage & Security
Security is our highest priority. The Gemini API key must never be committed to git repositories or hardcoded inside codebases.

*   **Development Configuration**: The API key is stored in a local `.env` configuration file (which is ignored by Git via `.gitignore`).
*   **Production Configuration**: The API key is injected directly into the application environment via secure container variables (such as AWS Secrets Manager, GitHub Secrets, or Doppler).
*   **Environment Variable Name**: `GEMINI_API_KEY`
*   **Fallback Check**: On system startup, the configuration manager checks for the presence of this variable. If missing, it prints a critical startup error and terminates the process, preventing faulty deployments.

---

### 2. Environment Variables Required
The backend relies on the following configurations:

```ini
PORT=3000
NODE_ENV=production
DATABASE_URL=postgresql://user:password@localhost:5432/fitxaidb
GEMINI_API_KEY=AIzaSyD_ExampleKeyHereYourGeminiToken
GEMINI_MODEL_NAME=gemini-1.5-flash
GEMINI_TEMPERATURE=0.2
GEMINI_TIMEOUT_MS=8000
```

---

### 3. Gemini Initialization
The integration is established using the official Google Gen AI client library (`@google/genai` or `@google/generative-ai` SDK):

*   **Initialization Timing**: The SDK client is initialized as a singleton during backend application boot.
*   **Connection Handling**: The initialized client instance is injected into the `GeminiClient` service wrapper. This single instance handles all incoming user requests, reducing memory footprint and setup overhead.

---

### 4. Model Selection
We select **`gemini-1.5-flash`** as our primary inference engine for the Progress Tracker feature.

*   **Why Gemini 1.5 Flash?**:
    *   *Low Latency*: It responds significantly faster (averaging 1.5 to 3 seconds) than heavier models, providing a better user experience for live dashboard updates.
    *   *Cost Efficiency*: It consumes fewer token credits, keeping operational costs low under high user volumes.
    *   *Structured Output Native Support*: It natively supports strict JSON output formats, which minimizes formatting errors.
*   **Alternative Path**: The model name is loaded from environmental variables, allowing developers to upgrade to newer models (like `gemini-2.0-pro` or subsequent releases) without altering any integration code.

---

### 5. Gemini Configuration Parameters
To ensure the output remains highly structural and predictable, we configure Gemini with these settings:

1.  **Temperature (`0.2`)**: A low temperature minimizes model creativity, forcing the AI to stick strictly to the prompt context, demographic values, and structured output formatting instructions.
2.  **Max Output Tokens (`2048`)**: Sets a limit on response length to prevent runaway text outputs while leaving enough headroom for comprehensive weekly feedback summaries.
3.  **Response Schema Constraint**: We configure the API request parameters with `responseMimeType: "application/json"`. This instructs Gemini's internal parser to reject freeform prose responses and respond only in standard JSON notation.
4.  **Safety Thresholds**: Configures safety filters to block harassment, hate speech, and sexually explicit content at a medium-and-above threshold. However, health and safety parameters are set to allow exercise guidance under strict medical disclaimer guardrails.

---

### 6. Prompt Loading & Dynamic Prompt Building
Prompts are compiled dynamically at runtime using a templating pattern:

*   **Prompt Segments**:
    *   *System Instructions*: The static role definition ("You are an expert fitness coach..."), structural JSON schemas, and safety policies. These are loaded from read-only constants in the codebase.
    *   *User Context Payload*: Dynamic JSON structures injected at runtime, consisting of the user's profile, today's workout metrics, and historical logs.
*   **Structure Tagging**: To make it easy for the LLM to separate system instructions from user data, the prompt compiler wraps dynamic data inside clean XML-like tags (e.g. `<userProfile>`, `<todayProgress>`, and `<previousHistory>`).
*   **Input Sanitization**: Before injecting subjective user comment notes into the prompt, the text is sanitized to remove carriage returns, double-quotes, or potential prompt injection markers, protecting prompt boundaries.

---

### 7. Sending Request & Receiving Response
The communication sequence follows a strict network gate:

1.  **Request Construction**: The service converts the compiled prompt string into a payload and invokes the Gemini generate content function.
2.  **Request Lifecycle & Timeout**: A network timeout controller of 8 seconds (8000ms) is attached to the request. If Gemini does not respond in this window, the controller aborts the connection, throws a timeout error, and triggers the local fallback engine.
3.  **Receiving Response**: The backend reads the resolved response object, extracting the raw content string.

---

### 8. Parsing JSON & Schema Validation
Because LLM responses are text streams, the backend must sanitize and validate the string before using it:

1.  **Formatting Cleanup**: The text is passed to a parser utility. It strips away accidental markdown fences (such as ` ```json ... ``` `) and extracts the valid text bounded between the first `{` and the last `}`.
2.  **JSON Deserialization**: The cleaned string is passed to `JSON.parse()`. If parsing fails due to syntax errors, a custom `JsonParsingException` is thrown.
3.  **Schema Validation**: The parsed object is validated using a schema library (like `zod` or `joi`). This checks:
    *   *Type Safety*: Confirms that `progressScore` is a number, `vulnerabilities` is an array of strings, etc.
    *   *Boundary Accuracy*: Checks that the score is within `0` and `100`.
    *   *Enum Alignment*: Confirms status strings match the expected values.
    *   *Property Completeness*: If optional keys are missing, the validator automatically assigns safe default fallbacks (e.g., empty arrays) instead of failing.

---

### 9. Error Handling & Retry Strategy
A robust application must gracefully handle failures. The AI Integration module implements a multi-tiered safety net:

```text
       [Gemini API Call Fails]
                  │
                  ▼
         [Check Error Type]
          /             \
 (Temporary Net error)   (Model validation / rate limit / 400 error)
        /                 \
 [Run Retry Loop]        [Skip Retries]
  - 3 attempts            - Log error details
  - Exponential backoff   - Call ErrorHandler
  - Add Jitter            - Return safe fallback JSON
        │
  (All retries fail)
        │
        ▼
 [Call ErrorHandler] ──> [Return safe fallback JSON]
```

1.  **Categorization**: Errors are divided into transient errors (network drops, rate limits, server timeouts) and non-transient errors (invalid prompt schema, bad API keys).
2.  **Retry Loop**: For transient network errors, the module runs a retry loop:
    *   *Max Attempts*: `3`.
    *   *Exponential Backoff*: The delay between retries scales exponentially (e.g., 1s, then 2s, then 4s).
    *   *Randomized Jitter*: Adds random offsets (milliseconds) to prevent concurrent backend threads from hitting the Gemini API simultaneously when recovering.
3.  **Zero-Retries**: Non-transient errors bypass the retry loop to save processing time.
4.  **Fallback Engine**: If all retries fail, or if a non-transient error occurs, the coordinator calls the `ErrorHandler` to generate a safe local report fallback. The HTTP connection resolves with `201 Created` or `200 OK` (using a partial success flag) so the frontend client can render the saved metrics, with a notice that the AI Coach is temporarily offline.

---

### 10. Logging & Monitoring
All integration activity is logged centrally to monitor health and costs:

*   **Logs Recorded**:
    *   *Request Start*: Timestamp and target user ID.
    *   *Telemetry*: Request duration (latency) and token counts (input/output) for cost analysis.
    *   *Success Status*: Success confirmation with execution times.
    *   *Failures*: Error messages, HTTP codes, and stack traces.
*   **Privacy Guard (PII Protection)**: The logger filters out sensitive user details (such as names, weights, or custom text notes) from debug messages to ensure user privacy.

---

### 11. Response Time Optimization
To ensure transactions resolve in under 5 seconds, we apply these optimizations:

1.  **Lightweight Models**: We use `gemini-1.5-flash` instead of larger models, cutting latency by more than 50%.
2.  **Prompt Compression**: We remove verbose descriptions from system prompts and omit large, unnecessary fields from history logs to minimize token load.
3.  **Read-Through Caching**: Daily AI reports are cached in the PostgreSQL database. If a user queries their report again on the same day, the database serves the cached result in under 100ms, completely bypassing the Gemini API.

---

### 12. Security Considerations
*   **Authentication Gates**: Endpoints connecting to the Gemini client are protected by JWT middleware, preventing unauthorized access and API abuse.
*   **Input Cleansing**: All progress logs are validated on the backend before prompt insertion to prevent prompt injection attacks designed to alter safety guardrails.
*   **Transport Layer Security**: All data in transit between the client, backend, and Google Gemini servers is encrypted using HTTPS (TLS 1.3).
*   **Metadata Protection**: Sensitive health notes are only stored in PostgreSQL and never sent to Gemini as persistent system training records.

---

### 13. Future Improvements
1.  **Asynchronous Background Worker**: Offload AI report compilation to a background queue (such as BullMQ). The API server stores the log and returns immediately, and a worker compiles the report in the background, pushing updates to the React client via WebSockets.
2.  **RAG-Powered Long-Term Context**: Instead of sending a static 7-day log history in prompt texts, implement a Retrieval-Augmented Generation (RAG) vector database (such as pgvector) to query relevant historical performance trends over longer periods (30, 90, or 365 days).
3.  **Model Fallback Routing**: If the Gemini API experiences sustained downtime, the backend coordinator can automatically route prompts to alternative LLM providers (like Anthropic Claude or a local LLaMA instance) to ensure continuous operation.
