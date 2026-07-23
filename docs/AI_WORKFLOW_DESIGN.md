# FitAI-X: Progress Tracker — AI Integration Workflow
## Complete End-to-End Workflow Specification

This document details the complete 17-step workflow of the **Progress Tracker** feature. It explains what occurs at each step in simple English and details the individual responsibilities of each team member (UX Designer, Frontend Developer, Backend Developer, AI Engineer, and QA Engineer).

---

## 1. Workflow Diagram

```text
User opens Progress Tracker
           │
           ▼
User fills Manual Progress Form
           │
           ▼
Frontend validates data
           │
           ▼
Frontend sends data to Backend
           │
           ▼
Backend validates and stores today's progress in PostgreSQL
           │
           ▼
Backend fetches user's previous 7 days progress
           │
           ▼
Backend prepares AI input (Today's Data + History)
           │
           ▼
Backend sends AI Prompt + User Data to Gemini AI
           │
           ▼
Gemini analyzes workout consistency
           │
           ▼
Gemini analyzes progress improvement
           │
           ▼
Gemini detects injury risk & user vulnerabilities
           │
           ▼
Gemini generates personalized recommendations
           │
           ▼
Gemini returns structured JSON report
           │
           ▼
Backend stores AI report in PostgreSQL
           │
           ▼
Frontend fetches AI report
           │
           ▼
Frontend displays progress score, analysis & recommendations
           │
           ▼
User views personalized AI Progress Report
```

---

## 2. Step-by-Step Explanation & Responsibilities

### Step 1: User opens Progress Tracker
*   **Explanation**: The user clicks on the "Progress Tracker" link or icon inside the FitAI-X application to view their performance statistics. The application renders the tracker interface.
*   **Team Responsibilities**:
    *   *UX Designer*: Ensures the tracker button is placed prominently in the navigation menu and that the page loads with a clean layout.
    *   *Frontend Developer*: Hooks up the page routing so that visiting `/progress` renders the correct dashboard component.
    *   *Backend Developer*: Exposes an endpoint to check if the user has already logged a workout today, returning status flags.
    *   *QA Engineer*: Tests that the page opens correctly across mobile, tablet, and desktop viewports.

---

### Step 2: User fills Manual Progress Form
*   **Explanation**: The user manually inputs their stats for the day (e.g. workout duration, water drank, sleep duration, pain scale, and subjective comments).
*   **Team Responsibilities**:
    *   *UX Designer*: Designs form inputs (sliders, drop-downs, and toggles) that are easy to tap and read on mobile devices.
    *   *Frontend Developer*: Implements React form components, maintaining state for each field.
    *   *QA Engineer*: Tests that all fields are selectable and that typing in text areas is fluid.

---

### Step 3: Frontend validates data
*   **Explanation**: Before sending data to the server, the browser checks that the entries are sensible (e.g. pain level must be between 0 and 10; sleep duration cannot exceed 24 hours).
*   **Team Responsibilities**:
    *   *Frontend Developer*: Implements client-side checks and displays error tags under invalid inputs.
    *   *QA Engineer*: Attempts to input invalid numbers (e.g., negative duration, 99 hours of sleep) to verify that the form blocks submission.

---

### Step 4: Frontend sends data to Backend
*   **Explanation**: The React client wraps the validated form fields into an HTTP POST request payload and transmits it securely to the API server.
*   **Team Responsibilities**:
    *   *Frontend Developer*: Configures the fetch/axios request and handles transition states, showing a loading indicator to the user.
    *   *Backend Developer*: Exposes the secure `/api/progress` route to accept incoming JSON payloads.
    *   *QA Engineer*: Monitors browser network logs to verify headers, payload content, and API response codes.

---

### Step 5: Backend validates and stores today's progress in PostgreSQL
*   **Explanation**: The backend checks the incoming payload for security risks and database constraints, then inserts the metrics into the PostgreSQL database.
*   **Team Responsibilities**:
    *   *Backend Developer*: Implements API input validation rules, maps fields to database schemas, and executes SQL inserts.
    *   *QA Engineer*: Verifies that database tables write records correctly and validate constraints (e.g., rejecting duplicate logs for the same day).

---

### Step 6: Backend fetches user's previous 7 days progress
*   **Explanation**: To provide context to the AI, the backend queries PostgreSQL for the user's demographic profile (age, goals) and retrieves their daily progress history for the previous 7 days.
*   **Team Responsibilities**:
    *   *Backend Developer*: Writes optimized SQL queries to select the last 7 chronological log rows for the logged-in user.
    *   *QA Engineer*: Tests cases where a user has less than 7 days of history (such as new users) to ensure the query returns empty arrays without crashing.

---

### Step 7: Backend prepares AI input (Today's Data + History)
*   **Explanation**: The backend merges the user profile, today's entry, and the 7-day historical array into a single structured JSON payload.
*   **Team Responsibilities**:
    *   *Backend Developer*: Packages the aggregated data into the matching AI Input JSON structure.
    *   *AI Engineer*: Defines the prompt template and confirms the backend is filling all variables correctly.
    *   *QA Engineer*: Audits the final compiled payload string before it is sent to the AI API.

---

### Step 8: Backend sends AI Prompt + User Data to Gemini AI
*   **Explanation**: The backend calls the Gemini API, passing the system prompt instructions and the user context JSON payload.
*   **Team Responsibilities**:
    *   *Backend Developer*: Manages Gemini SDK integration, handles connection timeouts, and sets up request retries.
    *   *AI Engineer*: Sets the temperature parameters and configures safety settings on the Gemini instance.
    *   *QA Engineer*: Tests system behavior during network interruptions or API server downtime.

---

### Step 9: Gemini analyzes workout consistency
*   **Explanation**: Gemini compares today's activity against the planned weekly training frequency and historical logs to evaluate habit compliance.
*   **Team Responsibilities**:
    *   *AI Engineer*: refines prompt text instructions so the AI accurately calculates completed vs missed sessions.
    *   *QA Engineer*: Audits consistency values against mock data inputs to confirm mathematical accuracy.

---

### Step 10: Gemini analyzes progress improvement
*   **Explanation**: Gemini compares today's workout durations and calories burned against historical averages to see if the user is improving or plateauing.
*   **Team Responsibilities**:
    *   *AI Engineer*: Optimizes prompt rules so that Gemini correctly flags upward/downward trends.
    *   *QA Engineer*: Assesses mock schedules to verify that improvements match performance changes.

---

### Step 11: Gemini detects injury risk & user vulnerabilities
*   **Explanation**: The AI scans pain logs, notes, and workload frequencies to spot injury indicators (e.g. rising muscle soreness or fatigue levels).
*   **Team Responsibilities**:
    *   *AI Engineer*: Adjusts safety system prompts to prevent AI from issuing concrete medical diagnoses while ensuring it flags critical joints.
    *   *QA Engineer*: Inserts high-pain entries (e.g. pain level 8 on back-to-back workouts) to ensure high-injury alerts are triggered.

---

### Step 12: Gemini generates personalized recommendations
*   **Explanation**: The AI compiles actionable coaching tasks (e.g., drink more water, stretch left knee) based on today's performance and gaps.
*   **Team Responsibilities**:
    *   *AI Engineer*: Directs recommendation priorities (High/Medium/Low) and categories (Diet, recovery, workout, safety).
    *   *QA Engineer*: Evaluates that recommendations are logical and directly helpful to the user's logged metrics.

---

### Step 13: Gemini returns structured JSON report
*   **Explanation**: Gemini outputs the analysis result in the raw JSON format specified in the output contract.
*   **Team Responsibilities**:
    *   *AI Engineer*: Configures prompt constraints and schemas to ensure the AI does not output extra text, conversational replies, or markdown blocks.
    *   *QA Engineer*: Validates that the returned output parses cleanly into standard JSON packages.

---

### Step 14: Backend stores AI report in PostgreSQL
*   **Explanation**: The backend parses the raw JSON from Gemini, runs validity checks, and inserts the generated report into the database for future retrieval.
*   **Team Responsibilities**:
    *   *Backend Developer*: Extracts fields, runs fallbacks if keys are missing, and writes the JSON blob to the `ai_reports` database table.
    *   *QA Engineer*: Validates that reports write correctly and reference both the user and the daily log correctly.

---

### Step 15: Frontend fetches AI report
*   **Explanation**: The frontend receives the response payload containing the new AI report, completing the request loop.
*   **Team Responsibilities**:
    *   *Frontend Developer*: Resolves the fetch promise, stops the loading spinner, and loads the data into the local component state.
    *   *QA Engineer*: Tests that HTTP fetch states (loading, success, error) function cleanly on slow mobile connections.

---

### Step 16: Frontend displays progress score, analysis & recommendations
*   **Explanation**: The frontend takes the JSON properties and populates the dashboard, rendering gauges, charts, bulleted recommendation feeds, and alert blocks.
*   **Team Responsibilities**:
    *   *UX Designer*: Creates mockups showing how components layout together.
    *   *Frontend Developer*: Codes the UI dashboard components, applying CSS styles for color-coded alerts and scores.
    *   *QA Engineer*: Audits layout margins and responsiveness on multiple device screen widths.

---

### Step 17: User views personalized AI Progress Report
*   **Explanation**: The user sees their dashboard update with their daily score, coach review, and safety recommendations, completing their interaction loop.
*   **Team Responsibilities**:
    *   *UX Designer*: Conducts user feedback sessions to ensure the dashboard metrics are easy to read and understand.
    *   *QA Engineer*: Verifies that the final user view is clear, accessible, and free of placeholder labels or broken layouts.
