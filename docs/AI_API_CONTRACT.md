# FitAI-X: Progress Tracker — API Contract Specification
## Backend Developer Handout (AI Integration Layer)

This document specifies the communication contract between the Frontend Client and the Backend API for the **Progress Tracker** feature. It details routes, data schemas, validation rules, error handling parameters, database dependencies, and the AI integration mapping.

---

### 1. Security & Authentication (Global)
*   **Protocol**: HTTPS
*   **Auth Mechanism**: HTTP Authorization Header with Bearer Token (`Authorization: Bearer <JWT>`)
*   **Common Headers**:
    *   `Content-Type: application/json`
    *   `Accept: application/json`

---

### 2. Endpoints Overview

```text
POST    /api/progress/log                           - Submit daily metrics & generate daily AI report
PUT     /api/progress/log/:date                     - Update metrics for a specific date & regenerate AI report
DELETE  /api/progress/log/:date                     - Delete a progress log and its associated AI report
POST    /api/progress/report/:date/regenerate       - Manually trigger/retry AI analysis for an existing log
GET     /api/progress/history                       - Fetch historical logs and AI reports
GET     /api/progress/report/:date                  - Retrieve AI report for a specific date
GET     /api/progress/analytics                     - Fetch aggregated dashboard statistics & analytics
POST    /api/progress/recommendations/:id/feedback  - Log action/feedback on a specific recommendation
GET     /api/progress/report/:date/export           - Export daily progress report as PDF or CSV
GET     /api/progress/settings                      - Retrieve AI coaching persona & settings
PUT     /api/progress/settings                      - Update AI coaching preferences
```

---

## 3. Route Details

### Route 1: `POST /api/progress/log`
*   **Purpose**: Receives the daily progress form log, writes it to PostgreSQL, fetches 7-day user history and profile context, runs Gemini AI analysis, caches the AI report, and returns the response.
*   **Authentication**: **Required**
*   **Request URL**: `/api/progress/log`

#### Request Validation Rules
*   `workoutCompleted` must be a Boolean.
*   If `workoutCompleted` is `true`:
    *   `workoutType` must be a non-empty string (max 50 chars).
    *   `workoutDuration` must be an integer between `5` and `360` (minutes).
    *   `caloriesBurned` must be an integer between `0` and `3000` (kcal).
*   `caloriesConsumed` must be an integer between `0` and `10000` (kcal).
*   `steps` must be an integer between `0` and `100000`.
*   `sleepHours` must be a float between `0.0` and `24.0`.
*   `waterIntake` must be a float between `0.0` and `15.0` (liters).
*   `mood` must match: `["Energetic", "Good", "Tired", "Exhausted", "Stressed"]`.
*   `energyLevel` must be an integer between `1` and `10`.
*   `injury.hasInjury` must be a Boolean.
*   If `injury.hasInjury` is `true`:
    *   `injury.painLevel` must be an integer between `0` and `10`.
    *   `injury.details` must be a string (max 250 chars).
*   `notes` must be a string (max 500 chars).

#### Database Data Requirements (Backend-side Aggregation)
Before invoking the Gemini API, the backend controller must query PostgreSQL for:
1.  **User Profile**: `age`, `gender`, `height`, `weight`, `fitnessLevel`, `currentGoal`, and target benchmarks (sleep, water, steps, workout frequency).
2.  **Historical Logs**: Up to the previous 7 days of daily progress records for the active `user_id`.

#### Backend-side AI Input Construction
The database rows and today's request body must be serialized into the structured format defined in [AI_INPUT.MD](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/AI_INPUT.MD) before being submitted to the AI model.

#### Expected AI Output Schema
The response returned by Gemini AI must match the exact JSON schema defined in [AI_OUTPUT.MD](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/AI_OUTPUT.MD).

#### Request JSON Example
```json
{
  "workoutCompleted": true,
  "workoutType": "Chest",
  "workoutDuration": 60,
  "caloriesBurned": 450,
  "caloriesConsumed": 2700,
  "steps": 9500,
  "sleepHours": 7.0,
  "waterIntake": 2.5,
  "mood": "Good",
  "energyLevel": 8,
  "injury": {
    "hasInjury": false,
    "painLevel": 0
  },
  "notes": "Felt good, minor shoulder fatigue on last reps."
}
```

#### Success Response JSON (Status Code: `201 Created`)
```json
{
  "status": "success",
  "data": {
    "logId": 9821,
    "date": "2026-07-22",
    "reportId": 4531,
    "report": {
      "progressScore": 85,
      "confidenceScore": 0.95,
      "consistencyAnalysis": {
        "status": "On Track",
        "completedWorkoutsCount": 5,
        "missedWorkoutsCount": 1,
        "weeklyAdherencePercentage": 83.3
      },
      "workoutPerformance": {
        "intensityLevel": "Moderate",
        "caloriesBurnedVariance": 12.5,
        "durationVariance": 5.0,
        "feedback": "Solid effort on Chest day. Met your target duration."
      },
      "recoveryAnalysis": {
        "status": "Adequate",
        "sleepQuality": "Good",
        "hydrationStatus": "Sub-optimal",
        "fatigueLevel": "Low",
        "insights": [
          "Water intake (2.5L) was slightly below your target (3.0L)."
        ]
      },
      "injuryRisk": {
        "riskLevel": "Low",
        "criticalAreas": [],
        "preventativeAction": ""
      },
      "userVulnerabilities": [
        "Hydration is below optimal levels."
      ],
      "improvementAnalysis": {
        "isImproving": true,
        "metricChanges": [
          "Duration is up by 5% over last week."
        ],
        "primaryBottleneck": "Dehydration is slowing metabolic recovery."
      },
      "goalProgress": {
        "status": "On Track",
        "estimatedWeeksToGoal": 12,
        "qualitativeAssessment": "Steady progression towards muscle gain."
      },
      "personalizedRecommendations": [
        {
          "category": "Recovery",
          "priority": "High",
          "action": "Increase water intake to 3.0 liters.",
          "rationale": "Compensates for workout sweating."
        }
      ],
      "motivationMessage": "Excellent workout today! Drink some water and keep up this consistency."
    }
  }
}
```

#### Error Responses

##### 1. Validation Error (Status Code: `400 Bad Request`)
*   **Trigger**: Sent body fails validation rules (e.g. invalid mood value, missing required field).
*   **Response JSON**:
    ```json
    {
      "status": "fail",
      "error": "VALIDATION_ERROR",
      "message": "Validation failed",
      "details": {
        "sleepHours": "sleepHours must be between 0.0 and 24.0",
        "mood": "mood must be one of: Energetic, Good, Tired, Exhausted, Stressed"
      }
    }
    ```

##### 2. Authentication Error (Status Code: `401 Unauthorized`)
*   **Trigger**: Token is missing, expired, or malformed.
*   **Response JSON**:
    ```json
    {
      "status": "fail",
      "error": "UNAUTHORIZED",
      "message": "Invalid credentials or missing authorization token"
    }
    ```

##### 3. Double Submission (Status Code: `409 Conflict`)
*   **Trigger**: User already logged workout metrics for today's date.
*   **Response JSON**:
    ```json
    {
      "status": "fail",
      "error": "DUPLICATE_LOG",
      "message": "Today's metrics have already been recorded. Use PUT request to modify today's log."
    }
    ```

##### 4. AI Engine Downtime / Fallback (Status Code: `200 OK` or `503 Service Unavailable`)
*   **Trigger**: Gemini AI is down, rate limited, or times out.
*   **Fallback Strategy**: The backend MUST store the workout log successfully in PostgreSQL. It then returns a success log confirmation but flags that the AI Analysis is offline, returning standard local database summary stats rather than failing the entire workout submission.
*   **Response JSON**:
    ```json
    {
      "status": "partial_success",
      "message": "Log stored, but AI Analysis is temporarily unavailable due to upstream connectivity issues.",
      "data": {
        "logId": 9821,
        "date": "2026-07-22",
        "reportId": null,
        "report": null
      }
    }
    ```

---

### Route 2: `PUT /api/progress/log/:date`
*   **Purpose**: Updates an existing daily progress log in PostgreSQL for the specified date, aggregates profile and historical logs, invokes Gemini AI to regenerate the AI Progress Report, and updates database records.
*   **Authentication**: **Required**
*   **Path Parameters**:
    *   `date`: Must be a valid date string in `YYYY-MM-DD` format.
*   **Request Validation Rules**: Identical to `POST /api/progress/log`.
*   **Success Response JSON (Status Code: `200 OK`)**:
    *   Returns the updated log data along with the regenerated AI report JSON structure (similar to `POST /api/progress/log` success response, but with `200 OK` status).

#### Error Responses
*   **400 Bad Request**: Date format validation or body validation failure.
*   **401 Unauthorized**: Missing or expired auth token.
*   **404 Not Found**: No log exists for the given date.
    ```json
    {
      "status": "fail",
      "error": "LOG_NOT_FOUND",
      "message": "No progress log exists for the specified date to update."
    }
    ```

---

### Route 3: `DELETE /api/progress/log/:date`
*   **Purpose**: Deletes the user's progress log for the specified date from PostgreSQL. All linked entries in the `ai_reports` table must be deleted via cascade constraints.
*   **Authentication**: **Required**
*   **Path Parameters**:
    *   `date`: Must be a valid date string in `YYYY-MM-DD` format.
*   **Success Response JSON (Status Code: `200 OK`)**:
    ```json
    {
      "status": "success",
      "message": "Daily progress log and associated AI report successfully deleted."
    }
    ```

#### Error Responses
*   **400 Bad Request**: Invalid date path format.
*   **401 Unauthorized**: Access denied.
*   **404 Not Found**: Record does not exist.

---

### Route 4: `POST /api/progress/report/:date/regenerate`
*   **Purpose**: Manually triggers AI analysis for a date that already has a progress log but does not have a report (e.g. if the original call failed with `partial_success`), or to force a fresh analysis.
*   **Authentication**: **Required**
*   **Path Parameters**:
    *   `date`: Must be a valid date string in `YYYY-MM-DD` format.
*   **Success Response JSON (Status Code: `200 OK`)**:
    *   Returns the newly created AI report payload.

#### Error Responses
*   **404 Not Found**: Triggered if no progress log exists for that date.
    ```json
    {
      "status": "fail",
      "error": "LOG_NOT_FOUND",
      "message": "Cannot generate report. Please log metrics for this date first."
    }
    ```
*   **503 Service Unavailable**: If Gemini AI is down during the regeneration attempt.

---

### Route 5: `GET /api/progress/history`
*   **Purpose**: Retrieves historical workout entries and their associated AI progress reports for dashboard timeline charts.
*   **Authentication**: **Required**
*   **Query Parameters**:
    *   `limit` (Optional Integer): Default: `7`, Max: `30`.
    *   `offset` (Optional Integer): Default: `0`.
*   **Success Response JSON (Status Code: `200 OK`)**:
    ```json
    {
      "status": "success",
      "count": 2,
      "data": [
        {
          "logId": 9821,
          "date": "2026-07-22",
          "workoutCompleted": true,
          "workoutType": "Chest",
          "workoutDuration": 60,
          "caloriesBurned": 450,
          "caloriesConsumed": 2700,
          "steps": 9500,
          "sleepHours": 7.0,
          "waterIntake": 2.5,
          "report": {
            "progressScore": 85,
            "consistencyAnalysis": { "status": "On Track" },
            "injuryRisk": { "riskLevel": "Low" }
          }
        },
        {
          "logId": 9811,
          "date": "2026-07-21",
          "workoutCompleted": false,
          "workoutType": null,
          "workoutDuration": 0,
          "caloriesBurned": 0,
          "caloriesConsumed": 2200,
          "steps": 4000,
          "sleepHours": 8.0,
          "waterIntake": 2.8,
          "report": {
            "progressScore": 75,
            "consistencyAnalysis": { "status": "Needs Attention" },
            "injuryRisk": { "riskLevel": "Low" }
          }
        }
      ]
    }
    ```

---

### Route 6: `GET /api/progress/report/:date`
*   **Purpose**: Retrieves the cached AI Report details for a specific calendar day.
*   **Authentication**: **Required**
*   **Path Parameters**:
    *   `date`: Must be a valid date string in `YYYY-MM-DD` format.
*   **Success Response JSON (Status Code: `200 OK`)**:
    ```json
    {
      "status": "success",
      "data": {
        "date": "2026-07-22",
        "reportId": 4531,
        "progressScore": 85,
        "consistencyAnalysis": {
          "status": "On Track",
          "weeklyAdherencePercentage": 83.3
        },
        "recoveryAnalysis": {
          "status": "Adequate",
          "insights": ["Water intake (2.5L) was slightly below your target (3.0L)."]
        },
        "injuryRisk": {
          "riskLevel": "Low"
        },
        "personalizedRecommendations": [
          {
            "category": "Recovery",
            "action": "Increase water intake to 3.0 liters."
          }
        ],
        "motivationMessage": "Excellent workout today! Drink some water and keep up this consistency."
      }
    }
    ```

#### Error Responses

##### 1. Date Format Error (Status Code: `400 Bad Request`)
*   **Trigger**: Requested `:date` does not match `YYYY-MM-DD` formatting rules.
*   **Response JSON**:
    ```json
    {
      "status": "fail",
      "error": "INVALID_DATE_FORMAT",
      "message": "The date parameter must be formatted as YYYY-MM-DD"
    }
    ```

##### 2. Record Not Found (Status Code: `404 Not Found`)
*   **Trigger**: No progress log or AI report exists in PostgreSQL for the specified date.
*   **Response JSON**:
    ```json
    {
      "status": "fail",
      "error": "REPORT_NOT_FOUND",
      "message": "No progress report found for the requested date"
    }
    ```

---

### Route 7: `GET /api/progress/analytics`
*   **Purpose**: Retrieves aggregated database statistics calculated over a range (7, 30, or 90 days) to populate dashboard analytics panels without overloading client-side rendering computations.
*   **Authentication**: **Required**
*   **Query Parameters**:
    *   `range` (Optional String): Enum: `["7d", "30d", "90d"]`. Default: `"7d"`.
*   **Success Response JSON (Status Code: `200 OK`)**:
    ```json
    {
      "status": "success",
      "data": {
        "dateRange": "30d",
        "aggregates": {
          "averageProgressScore": 81.2,
          "workoutsCompleted": 22,
          "workoutsPlanned": 24,
          "workoutAdherenceRate": 91.6,
          "averageSleepHours": 7.4,
          "sleepTargetAchievementRate": 85.0,
          "averageWaterIntake": 2.9,
          "waterTargetAchievementRate": 78.5,
          "totalCaloriesBurned": 9240,
          "averageStepsPerDay": 8430,
          "averagePainLevel": 1.2
        },
        "workoutDistribution": {
          "Chest": 6,
          "Back": 6,
          "Legs": 5,
          "Cardio": 5
        }
      }
    }
    ```

---

### Route 8: `POST /api/progress/recommendations/:id/feedback`
*   **Purpose**: Records user interactions with the AI-suggested recommendations (such as logging completion tasks or marking votes/helpful ratings) to optimize subsequent prompt engineering templates.
*   **Authentication**: **Required**
*   **Path Parameters**:
    *   `id`: String or alphanumeric identifier representing the recommendation item.
*   **Request Validation Rules**:
    *   `status` (String): Required. Enum: `["Completed", "Dismissed", "Pending"]`.
    *   `helpful` (Boolean): Optional. True/False indicators detailing user subjective value rating.
*   **Success Response JSON (Status Code: `200 OK`)**:
    ```json
    {
      "status": "success",
      "message": "Recommendation task status and user value feedback logged successfully."
    }
    ```

#### Error Responses
*   **400 Bad Request**: Missing required `status` parameter or invalid validation enum.
*   **404 Not Found**: The specified recommendation ID does not exist in the database.

---

### Route 9: `GET /api/progress/report/:date/export`
*   **Purpose**: Exports a formatted daily progress log and AI feedback file to external files (such as PDF or CSV document formats).
*   **Authentication**: **Required**
*   **Path Parameters**:
    *   `date`: Must be a valid date string in `YYYY-MM-DD` format.
*   **Query Parameters**:
    *   `format` (Optional String): Enum: `["pdf", "csv"]`. Default: `"pdf"`.
*   **Success Response (Status Code: `200 OK`)**:
    *   **Response Header**: `Content-Type: application/pdf` or `text/csv`
    *   **Response Header**: `Content-Disposition: attachment; filename="fitxai-report-2026-07-22.pdf"`
    *   **Response Body**: Binary document file data payload (Octet-stream).

#### Error Responses
*   **404 Not Found**: No log/report details found for that calendar date.
*   **400 Bad Request**: Unsupported document formatting extensions.

---

### Route 10: `GET /api/progress/settings`
*   **Purpose**: Retrieves the active user's AI coaching configuration settings, defining custom prompt parameters.
*   **Authentication**: **Required**
*   **Success Response JSON (Status Code: `200 OK`)**:
    ```json
    {
      "status": "success",
      "data": {
        "coachPersona": "Motivational",
        "enableSafetyAlerts": true,
        "priorityFocus": ["Sleep Recovery", "Hydration"],
        "weeklySummaryOptIn": true
      }
    }
    ```

---

### Route 11: `PUT /api/progress/settings`
*   **Purpose**: Updates the user's AI coaching configuration settings. The updated fields are dynamically fed to the prompt engine in next API queries.
*   **Authentication**: **Required**
*   **Request Validation Rules**:
    *   `coachPersona` (String): Required. Enum: `["Motivational", "Strict", "Analytical", "Enthusiastic"]`.
    *   `enableSafetyAlerts` (Boolean): Required.
    *   `priorityFocus` (Array of Strings): Required. Max 3 items. Eligible strings: `["Sleep Recovery", "Hydration", "Muscle Hypertrophy", "Cardio Performance"]`.
    *   `weeklySummaryOptIn` (Boolean): Required.
*   **Success Response JSON (Status Code: `200 OK`)**:
    ```json
    {
      "status": "success",
      "data": {
        "coachPersona": "Strict",
        "enableSafetyAlerts": true,
        "priorityFocus": ["Sleep Recovery"],
        "weeklySummaryOptIn": true
      }
    }
    ```
