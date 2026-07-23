# FitAI-X: Progress Tracker — AI Implementation Checklist
## Senior Developer Step-by-Step Execution Guide

This document specifies the complete, phase-by-phase implementation checklist for developing the **AI Integration & Analysis** module of the FitAI-X Progress Tracker feature.

All tasks in this checklist follow the established software architecture and directly reference the single source of truth documentation:
*   [AI_MODULE_ARCHITECTURE.md](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/AI_MODULE_ARCHITECTURE.md)
*   [GEMINI_INTEGRATION_DESIGN.md](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/GEMINI_INTEGRATION_DESIGN.md)
*   [GEMINI_ERROR_HANDLING_STRATEGY.md](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/GEMINI_ERROR_HANDLING_STRATEGY.md)
*   [AI_API_CONTRACT.md](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/AI_API_CONTRACT.md)
*   [AI_INPUT.md](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/AI_INPUT.MD)
*   [AI_OUTPUT.md](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/AI_OUTPUT.MD)
*   [AI_PROMPT.md](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/AI_PROMPT.MD)
*   [AI_WORKFLOW_DESIGN.md](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/AI_WORKFLOW_DESIGN.md)
*   [AI_VALIDATION_STRATEGY.md](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/AI_VALIDATION_STRATEGY.md)

---

### Phase 1 – Environment Setup

- [ ] **1.1 Install Project Dependencies**
  - [ ] Install official Google Gen AI SDK client library (`@google/genai` or `@google/generative-ai`) in backend root.
  - [ ] Install utility packages: `dotenv`, `express`, `zod`, `pg` (or `@prisma/client`), and `cors`.
  - [ ] Install developer TypeScript types (`@types/node`, `@types/express`, `@types/pg`).

- [ ] **1.2 Configure Environment Variables**
  - [ ] Create local `.env` file in `backend/` directory referencing variables specified in [GEMINI_INTEGRATION_DESIGN.md](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/GEMINI_INTEGRATION_DESIGN.md):
    ```ini
    PORT=3000
    NODE_ENV=development
    DATABASE_URL=postgresql://user:password@localhost:5432/fitxaidb
    GEMINI_API_KEY=AIzaSyD_YourProductionGeminiApiKeyHere
    GEMINI_MODEL_NAME=gemini-1.5-flash
    GEMINI_TEMPERATURE=0.2
    GEMINI_TIMEOUT_MS=8000
    ```
  - [ ] Confirm `.env` is listed in `.gitignore` to prevent committing secrets to version control.

- [ ] **1.3 Implement Environment Startup Check**
  - [ ] Create `src/config/env.config.ts` to validate environment variables during server boot.
  - [ ] Implement check: terminate startup (`process.exit(1)`) with descriptive error if `GEMINI_API_KEY` or `DATABASE_URL` is missing.

- [ ] **1.4 Create AI Module Directory Structure**
  - [ ] Establish directory structure matching [AI_MODULE_ARCHITECTURE.md](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/AI_MODULE_ARCHITECTURE.md):
    ```text
    src/
    ├── services/
    │   └── ai/
    │       ├── AICoordinator.ts
    │       ├── PromptBuilder.ts
    │       ├── GeminiClient.ts
    │       ├── SchemaValidator.ts
    │       └── ErrorHandler.ts
    ├── controllers/
    │   └── ProgressController.ts
    └── routes/
        └── progress.routes.ts
    ```

---

### Phase 2 – Gemini Configuration

- [ ] **2.1 Initialize SDK Client Singleton**
  - [ ] Create `GeminiClient.ts` wrapper class.
  - [ ] Initialize Google Gen AI client singleton instance during module load.
  - [ ] Verify single client instance is reused across incoming requests to minimize setup overhead.

- [ ] **2.2 Configure Model & Generation Parameters**
  - [ ] Set inference model to `gemini-1.5-flash` via `GEMINI_MODEL_NAME`.
  - [ ] Set `temperature: 0.2` to minimize hallucination and enforce deterministic structure.
  - [ ] Set `maxOutputTokens: 2048` to allow complete weekly analysis without truncation.
  - [ ] Set `responseMimeType: "application/json"` to force native JSON output.

- [ ] **2.3 Configure Safety Settings**
  - [ ] Set harassment, hate speech, and explicit content thresholds to `BLOCK_MEDIUM_AND_ABOVE`.
  - [ ] Ensure exercise guidance safety guardrails are active without false positive triggers.

- [ ] **2.4 Implement Network Timeout Controller**
  - [ ] Implement `AbortController` in `GeminiClient.ts` with `GEMINI_TIMEOUT_MS` (8000ms).
  - [ ] Catch timeout exceptions (`GeminiTimeoutException`) and abort request when network delay exceeds 8 seconds.

- [ ] **2.5 Implement Retry Mechanism with Backoff**
  - [ ] Implement exponential backoff with jitter (max 3 retries) in `GeminiClient.ts` as specified in [GEMINI_ERROR_HANDLING_STRATEGY.md](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/GEMINI_ERROR_HANDLING_STRATEGY.md).
  - [ ] Apply retries exclusively to transient errors (HTTP 429 Rate Limits, socket hangups, DNS resets).
  - [ ] Immediately skip retries for non-retryable errors (HTTP 401/403 Invalid API Key).

---

### Phase 3 – Prompt Integration

- [ ] **3.1 Load System Instructions**
  - [ ] Copy production system instructions from [AI_PROMPT.md](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/AI_PROMPT.MD) into read-only constant file `src/services/ai/prompts/systemPrompt.ts`.
  - [ ] Verify prompt persona ("AI Fitness Coach"), analysis steps, schema requirements, and safety guardrails are intact.

- [ ] **3.2 Build Dynamic Payload Serializer**
  - [ ] Create `PromptBuilder.ts` to assemble dynamic user payload string.
  - [ ] Ensure payload strictly follows the 3-root-section structure defined in [AI_INPUT.md](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/AI_INPUT.MD):
    - [ ] `userProfile`: `userId`, `name`, `age`, `gender`, `height`, `weight`, `fitnessLevel`, `currentGoal`, `workoutPlan` object.
    - [ ] `todayProgress`: `date`, `workoutCompleted`, `workoutType`, `workoutDuration`, `caloriesBurned`, `caloriesConsumed`, `steps`, `sleepHours`, `waterIntake`, `mood`, `energyLevel`, `injury` object, `notes`.
    - [ ] `previousHistory`: Array of 0 to 7 previous daily progress logs.

- [ ] **3.3 Implement XML Tag Wrapping & Sanitization**
  - [ ] Wrap runtime context sections in clean XML tags (`<userProfile>`, `<todayProgress>`, `<previousHistory>`) per [GEMINI_INTEGRATION_DESIGN.md](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/GEMINI_INTEGRATION_DESIGN.md).
  - [ ] Implement text sanitizer for subjective comments (`todayProgress.notes`): escape quotes, remove newline characters, and strip potential prompt injection command sequences.

- [ ] **3.4 Implement Cold-Start Detection**
  - [ ] Check `previousHistory` array length in `PromptBuilder.ts`.
  - [ ] If `previousHistory.length < 3`, append cold-start context directive instructing Gemini to adjust `confidenceScore` (~0.35) and establish baseline metrics.

---

### Phase 4 – Backend Integration

- [ ] **4.1 Implement Service Coordinator Orchestrator**
  - [ ] Create `AICoordinator.ts` adopting Service Coordinator Pattern from [AI_MODULE_ARCHITECTURE.md](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/AI_MODULE_ARCHITECTURE.md).
  - [ ] Implement `generateReport(userProfile, todayProgress, previousHistory)` method that coordinates `PromptBuilder` -> `GeminiClient` -> `SchemaValidator` -> `ErrorHandler`.

- [ ] **4.2 Create HTTP Progress Routes & Controller**
  - [ ] Create `ProgressController.ts` and route handler `POST /api/progress/log` matching [AI_API_CONTRACT.md](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/AI_API_CONTRACT.md).
  - [ ] Implement JWT Authentication middleware (`Authorization: Bearer <JWT>`) for route security.
  - [ ] Implement rate-limiting middleware (limit 5 log submissions per minute per IP/user).

- [ ] **4.3 Request Body Validation**
  - [ ] Validate request body fields against limits specified in [AI_API_CONTRACT.md](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/AI_API_CONTRACT.md):
    - [ ] `workoutCompleted` (Boolean required)
    - [ ] `workoutType` (String required if completed, max 50 chars)
    - [ ] `workoutDuration` (Integer, 5–360 mins)
    - [ ] `caloriesBurned` (Integer, 0–3000 kcal)
    - [ ] `caloriesConsumed` (Integer, 0–10000 kcal)
    - [ ] `steps` (Integer, 0–100000)
    - [ ] `sleepHours` (Float, 0.0–24.0)
    - [ ] `waterIntake` (Float, 0.0–15.0 L)
    - [ ] `mood` (Enum: `["Energetic", "Good", "Tired", "Exhausted", "Stressed"]`)
    - [ ] `energyLevel` (Integer, 1–10)
    - [ ] `injury`: `{ hasInjury: Boolean, painLevel: 0-10, details: String }`

---

### Phase 5 – AI Response Validation

- [ ] **5.1 Create Multi-Gate Schema Validator**
  - [ ] Create `SchemaValidator.ts` enforcing the 3-Gate Validation Architecture in [AI_VALIDATION_STRATEGY.md](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/AI_VALIDATION_STRATEGY.md).

- [ ] **5.2 Implement Gate 1 (JSON Syntax & Cleaning)**
  - [ ] Extract JSON content between first `{` and last `}`.
  - [ ] Strip markdown code fences (` ```json ` or ` ``` `).
  - [ ] Execute `JSON.parse()`. If syntax error occurs, route directly to `ErrorHandler.ts`.

- [ ] **5.3 Implement Gate 2 (Schema & Type Enforcement)**
  - [ ] Validate presence and data types of all top-level keys in [AI_OUTPUT.md](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/AI_OUTPUT.MD):
    - [ ] `progressScore` (Integer)
    - [ ] `confidenceScore` (Float)
    - [ ] `consistencyAnalysis` (Object: `status`, `completedWorkoutsCount`, `missedWorkoutsCount`, `weeklyAdherencePercentage`)
    - [ ] `workoutPerformance` (Object: `intensityLevel`, `caloriesBurnedVariance`, `durationVariance`, `feedback`)
    - [ ] `recoveryAnalysis` (Object: `status`, `sleepQuality`, `hydrationStatus`, `fatigueLevel`, `insights` array)
    - [ ] `injuryRisk` (Object: `riskLevel`, `criticalAreas` array, `preventativeAction`)
    - [ ] `userVulnerabilities` (Array of Strings)
    - [ ] `improvementAnalysis` (Object: `isImproving`, `metricChanges` array, `primaryBottleneck`)
    - [ ] `goalProgress` (Object: `status`, `estimatedWeeksToGoal`, `qualitativeAssessment`)
    - [ ] `personalizedRecommendations` (Array of Objects: `category`, `priority`, `action`, `rationale`)
    - [ ] `motivationMessage` (String)
  - [ ] Inject field defaults for missing non-critical keys.

- [ ] **5.4 Implement Gate 3 (Range & Enum Clamping)**
  - [ ] Clamp `progressScore` to `[0, 100]`.
  - [ ] Clamp `confidenceScore` to `[0.0, 1.0]`.
  - [ ] Validate enums:
    - [ ] `consistencyAnalysis.status`: `["Excellent", "On Track", "Needs Attention", "Unsatisfactory"]`
    - [ ] `workoutPerformance.intensityLevel`: `["High", "Moderate", "Low"]`
    - [ ] `recoveryAnalysis.status`: `["Optimal", "Adequate", "Impaired", "Critical"]`
    - [ ] `injuryRisk.riskLevel`: `["Low", "Moderate", "High"]`

- [ ] **5.5 Implement Local Fallback Generator**
  - [ ] Create `ErrorHandler.ts` with local fallback engine `generateFallbackReport()`.
  - [ ] Ensure fallback returns complete, valid JSON object matching [AI_OUTPUT.md](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/AI_OUTPUT.MD) when Gemini is unreachable.

---

### Phase 6 – Database Integration

- [ ] **6.1 Configure PostgreSQL Schema**
  - [ ] Create/update database tables using Prisma or Migration scripts:
    - [ ] `daily_progress` table storing today's log fields.
    - [ ] `ai_reports` table storing report metrics and `JSONB` columns (`recovery_analysis`, `injury_risk`, `personalized_recommendations`, etc.).
  - [ ] Configure foreign key: `ai_reports.progress_id` references `daily_progress.id` with `ON DELETE CASCADE`.

- [ ] **6.2 Create Database Indexes**
  - [ ] Create composite index `CREATE INDEX idx_daily_progress_user_date ON daily_progress (user_id, date DESC);` to guarantee 7-day history query completes in < 20ms.

- [ ] **6.3 Implement Controller Transaction Flow**
  - [ ] Inside `POST /api/progress/log` controller:
    1. Begin database transaction.
    2. Insert row into `daily_progress`.
    3. Query past 7 daily logs from `daily_progress`.
    4. Query user profile from `users` table.
    5. Invoke `AICoordinator.generateReport()`.
    6. Insert AI report row into `ai_reports` table.
    7. Commit transaction and return HTTP `201 Created` with report payload.

- [ ] **6.4 Handle Database Fallback Resilience**
  - [ ] Ensure that if Gemini call fails, the fallback report is saved to `ai_reports` with flag `is_fallback = true` to preserve user experience.

---

### Phase 7 – Frontend Integration

- [ ] **7.1 Build React Progress Logging Form**
  - [ ] Create `ManualProgressForm.tsx` supporting metrics: workout completed, type, duration, calories burned, calories consumed, steps, sleep, water, mood, energy level, injury status/details, notes.
  - [ ] Add client-side validation mirroring rules in [AI_API_CONTRACT.md](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/AI_API_CONTRACT.md).

- [ ] **7.2 Implement API Service Integration**
  - [ ] Create `src/api/progressApi.ts` in React app to execute `POST /api/progress/log`.
  - [ ] Attach `Authorization: Bearer <token>` header to requests.

- [ ] **7.3 Build AI Dashboard Widgets**
  - [ ] Create dashboard UI components corresponding to [AI_OUTPUT.md](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/AI_OUTPUT.MD):
    - [ ] `ProgressScoreCard.tsx` (Score gauge 0–100)
    - [ ] `ConsistencyWidget.tsx` (Status badge, adherence %, completed/missed count)
    - [ ] `WorkoutPerformanceWidget.tsx` (Intensity badge, duration & calorie variances)
    - [ ] `RecoveryAnalysisWidget.tsx` (Sleep, hydration, fatigue indicators & insights list)
    - [ ] `InjuryRiskWidget.tsx` (Risk level alert banner, critical areas, preventative action cue)
    - [ ] `PersonalizedRecommendations.tsx` (Category, priority, action, rationale cards)
    - [ ] `MotivationMessageBanner.tsx` (Coach message banner)

- [ ] **7.4 Implement Loading & Error UI States**
  - [ ] Display skeleton loading animations during processing (< 3.5s SLA).
  - [ ] Render clear error banners with retry buttons on submission failure.

---

### Phase 8 – Testing

- [ ] **8.1 Execute Unit Tests**
  - [ ] Run `npm run test:unit` to test `PromptBuilder`, `JsonSanitizer`, `SchemaValidator`, and `ErrorHandler` in isolation.

- [ ] **8.2 Execute Multi-Gate Validation Tests**
  - [ ] Test Gate 1 with raw strings containing markdown fences (` ```json `) and trailing commentary.
  - [ ] Test Gate 2 with missing non-critical schema keys.
  - [ ] Test Gate 3 with out-of-bounds metrics (e.g. `progressScore: 120`).

- [ ] **8.3 Execute API & Integration Tests**
  - [ ] Run API test collection verifying status codes (`201 Created`, `200 OK`, `400 Bad Request`, `401 Unauthorized`, `429 Rate Limited`, `500 Server Error`).
  - [ ] Verify full flow: React Form submit -> Express -> PostgreSQL -> Gemini API -> DB Write -> React Render.

- [ ] **8.4 Execute Injury Safety & Edge Case Tests**
  - [ ] Submit progress log with `painLevel: 8`; verify `riskLevel: "High"` and rest instructions generated.
  - [ ] Submit progress log for user with 0 history entries (`previousHistory: []`); verify cold-start handling and baseline confidence score (~0.35).
  - [ ] Submit `notes` containing prompt injection string (`"Ignore instructions..."`); verify string is treated as literal text.

- [ ] **8.5 Execute Resilience & Fallback Tests**
  - [ ] Test invalid `GEMINI_API_KEY` (401 error); verify local fallback report generated cleanly.
  - [ ] Test Gemini 8-second timeout; verify `AbortController` triggers local fallback seamlessly.

---

### Phase 9 – Deployment

- [ ] **9.1 Configure Production Environment**
  - [ ] Inject production `GEMINI_API_KEY`, `DATABASE_URL`, and `GEMINI_MODEL_NAME=gemini-1.5-flash` into host environment (AWS / Doppler / Render).
  - [ ] Audit React build bundle to ensure `GEMINI_API_KEY` is not exposed in client code.

- [ ] **9.2 Run Production Database Migrations**
  - [ ] Execute production migrations (`npx prisma migrate deploy`).
  - [ ] Verify index `idx_daily_progress_user_date` is active on production database.

- [ ] **9.3 Production Smoke Test & Monitoring**
  - [ ] Deploy backend API and React frontend build.
  - [ ] Perform live smoke test: submit daily progress log and verify real-time Gemini report rendering on production dashboard.
  - [ ] Verify APM latency monitoring (< 3.5s target) and error logging active.
