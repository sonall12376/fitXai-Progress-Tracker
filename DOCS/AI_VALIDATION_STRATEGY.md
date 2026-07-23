# FitAI-X: Progress Tracker — AI Validation Strategy
## Senior Software Quality Engineer System Specification

This document defines the validation strategy, testing rules, and error recovery policies for the JSON data returned by the Gemini AI integration. It ensures that the backend maintains data integrity, preventing corrupt or malformed LLM responses from causing application failures or rendering issues on the frontend.

---

### 1. The Multi-Gate Validation Architecture

To ensure data integrity, the system processes responses through three distinct validation gates:

```text
[Raw text from Gemini]
         │
         ▼
 ┌───────────────┐
 │    Gate 1     │ ──(Syntax Fail)──> [Trigger ErrorHandler (Fallback)]
 │ JSON Parsing  │
 └───────┬───────┘
         │ (Valid JSON syntax)
         ▼
 ┌───────────────┐
 │    Gate 2     │ ──(Missing/Wrong Types)──> [Apply Default Values]
 │  Schema Check │
 └───────┬───────┘
         │ (Structure Matches)
         ▼
 ┌───────────────┐
 │    Gate 3     │ ──(Values Out-of-Bounds)──> [Clamping / Correction]
 │ Range/Bounds  │
 └───────┬───────┘
         │ (Clean & Valid Object)
         ▼
[Passed to Controller & DB]
```

---

### 2. Validation Gate 1: JSON Parsing
*   **Purpose**: Ensures that the raw text response from the LLM can be converted into a standard JavaScript/TypeScript object.
*   **Sanitization Rules**:
    *   Find the first `{` and last `}` and extract the text between them. This removes any conversational text before or after the JSON.
    *   Strip out any markdown code fences (like ` ```json ` or ` ``` `).
*   **Failure Protocol**: If `JSON.parse()` throws a syntax error (e.g. due to missing quotes or trailing commas), the request is flagged as failed. It bypasses further gates, logs a critical validation error, and calls the `ErrorHandler` to fetch the local database fallback report.

---

### 3. Validation Gate 2: Schema Validation (Fields & Types)

Every field in the AI output is evaluated against strict type, presence, and optionality rules:

#### Table of Type & Presence Contracts

| Field Name | Expected Type | Presence Rule | Default Value (On Failure) |
| :--- | :--- | :--- | :--- |
| `progressScore` | Integer | **Required** | `0` (Forces recalculation) |
| `confidenceScore` | Float | **Required** | `0.0` |
| `consistencyAnalysis` | Object | **Required** | Nested Default Object |
| `consistencyAnalysis.status` | String | **Required** | `"Needs Attention"` |
| `consistencyAnalysis.completedWorkoutsCount` | Integer | **Required** | `0` |
| `consistencyAnalysis.missedWorkoutsCount` | Integer | **Required** | `0` |
| `consistencyAnalysis.weeklyAdherencePercentage` | Float | **Required** | `0.0` |
| `workoutPerformance` | Object | **Required** | Nested Default Object |
| `workoutPerformance.intensityLevel` | String | **Required** | `"Low"` |
| `workoutPerformance.caloriesBurnedVariance` | Float | **Required** | `0.0` |
| `workoutPerformance.durationVariance` | Float | **Required** | `0.0` |
| `workoutPerformance.feedback` | String | **Required** | `"Workout recorded."` |
| `recoveryAnalysis` | Object | **Required** | Nested Default Object |
| `recoveryAnalysis.status` | String | **Required** | `"Adequate"` |
| `recoveryAnalysis.sleepQuality` | String | **Required** | `"Fair"` |
| `recoveryAnalysis.hydrationStatus` | String | **Required** | `"Sub-optimal"` |
| `recoveryAnalysis.fatigueLevel` | String | **Required** | `"Medium"` |
| `recoveryAnalysis.insights` | Array of Strings | **Required** | `["No recovery insights generated."] ` |
| `injuryRisk` | Object | **Required** | Nested Default Object |
| `injuryRisk.riskLevel` | String | **Required** | `"Low"` |
| `injuryRisk.criticalAreas` | Array of Strings | **Required** | `[]` (Empty list) |
| `injuryRisk.preventativeAction` | String | **Required** | `""` (Empty string) |
| `userVulnerabilities` | Array of Strings | **Required** | `[]` (Empty list) |
| `improvementAnalysis` | Object | **Required** | Nested Default Object |
| `improvementAnalysis.isImproving` | Boolean | **Required** | `false` |
| `improvementAnalysis.metricChanges` | Array of Strings | **Required** | `[]` (Empty list) |
| `improvementAnalysis.primaryBottleneck` | String | **Required** | `"None identified."` |
| `goalProgress` | Object | **Required** | Nested Default Object |
| `goalProgress.status` | String | **Required** | `"On Track"` |
| `goalProgress.estimatedWeeksToGoal` | Integer | **Optional** (Nullable) | `null` |
| `goalProgress.qualitativeAssessment` | String | **Required** | `"Progressing toward goal."` |
| `personalizedRecommendations` | Array of Objects | **Required** | `[]` (Empty list) |
| `motivationMessage` | String | **Required** | `"Keep up the hard work!"` |

---

### 4. Validation Gate 3: Range & Value Validation Rules

Once fields are typed, their values are evaluated against logical ranges and enumerated sets:

#### 1. Progress Score
*   **Validation Rule**: Must be an integer between `0` and `100`.
*   **Correction Logic (Clamping)**: If the value is negative (e.g. `-5`), it is corrected to `0`. If the value exceeds `100` (e.g. `110`), it is corrected to `100`.

#### 2. Consistency Analysis
*   **`status`**: Must match: `["Excellent", "On Track", "Needs Attention", "Unsatisfactory"]`. If it matches none, defaults to `"Needs Attention"`.
*   **`completedWorkoutsCount` / `missedWorkoutsCount`**: Must be an integer between `0` and `7`. Clamped to `0` if lower, and `7` if higher.
*   **`weeklyAdherencePercentage`**: Must be a float between `0.0` and `100.0`. Clamped if out-of-bounds.

#### 3. Workout Performance
*   **`intensityLevel`**: Must match: `["High", "Moderate", "Low"]`. Defaults to `"Low"`.
*   **`caloriesBurnedVariance` / `durationVariance`**: Percentage difference floats. Acceptable range: `-100.0` to `500.0`. If outside, defaulted to `0.0`.
*   **`feedback`**: String, length must be between `10` and `150` characters. If too short or long, replaced with a generic fallback sentence template using today's logged metrics.

#### 4. Recovery Analysis
*   **`status`**: Must match: `["Optimal", "Adequate", "Impaired", "Critical"]`.
*   **`sleepQuality`**: Must match: `["Good", "Fair", "Poor"]`.
*   **`hydrationStatus`**: Must match: `["Optimal", "Sub-optimal", "Critical"]`.
*   **`fatigueLevel`**: Must match: `["Low", "Medium", "High"]`.
*   **`insights`**: Array containing strings (max 120 characters per string). All insights exceeding 120 characters are truncated with an ellipsis (`...`).

#### 5. Injury Risk
*   **`riskLevel`**: Must match: `["Low", "Moderate", "High"]`.
*   **`criticalAreas`**: Array containing string keys of joints/muscles (e.g. `"Knee"`, `"Lower Back"`, `"Shoulder"`). Rejects free-form sentences.
*   **`preventativeAction`**: String. If `riskLevel` is `"High"` or `"Moderate"`, this string must not be empty. If empty, defaults to: *"Focus on mobility and keep training volume light."*

#### 6. Goal Progress
*   **`status`**: Must match: `["Ahead of Plan", "On Track", "Behind Plan", "Stagnant"]`.
*   **`estimatedWeeksToGoal`**: Must be an integer between `1` and `104`, or `null`. If outside, set to `null`.

#### 7. Personalized Recommendations
*   **Array Size**: Must contain between `1` and `5` objects. If empty, the validator injects a default hydration/sleep recommendation based on today's logged metrics.
*   **`category`**: Must match: `["Workout", "Diet", "Recovery", "Safety"]`.
*   **`priority`**: Must match: `["High", "Medium", "Low"]`.
*   **`action`**: String, length between `15` and `100` characters.
*   **`rationale`**: String, length between `15` and `150` characters.

#### 8. Confidence Score
*   **Validation Rule**: Must be a float between `0.0` and `1.0`. Clamped if out-of-bounds.

---

### 5. Invalid Response & Error Validation Handling

When the model returns malformed JSON or values that fail schema validation, the system applies these recovery strategies:

1.  **Partial Failure Recovery (Soft Fixes)**:
    *   If the overall JSON structure is correct but a specific field is missing or contains an out-of-bounds value (e.g. `sleepHours` was logged but `recoveryAnalysis.sleepQuality` is missing), the validator corrects that specific field using the default values in Gate 2. This prevents the entire report from failing.
2.  **Total Failure Recovery (Hard Fixes)**:
    *   If the response is completely unparseable (e.g. missing closing brackets or truncated text), the system throws a validation error.
    *   The `AnalysisEngine` intercepts the error and routes the request to the `ErrorHandler` component.
    *   The `ErrorHandler` compiles a safe, pre-structured fallback report from database stats (calculating basic averages from the user's logged history).
    *   The backend saves this fallback report to PostgreSQL and returns a success response with a partial success message, alerting the frontend that live AI coaching feedback is offline but their workout log is saved.
3.  **Auditing & Alerts**:
    *   If the AI module's failure rate (where fallback reports are triggered) exceeds **2% of daily requests**, the system triggers automated alerts (via email or Slack integrations) to notify developers of potential model drift or upstream API changes.
