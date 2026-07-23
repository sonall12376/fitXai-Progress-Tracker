# FitAI-X: Progress Tracker — AI Input Specification
## Senior AI Solution Architect Design Document

This document defines the complete structural contract and semantic guidelines for the input data payload delivered from the FitAI-X backend to the Gemini AI integration. The AI utilizes this payload to run comparative, correlative, and diagnostic analyses.

---

### 1. Complete JSON Schema Structure

The data payload consists of three root-level sections:
1.  `userProfile`: Demographic baselines, fitness levels, current goals, and target benchmarks.
2.  `todayProgress`: Detailed performance and recovery metrics logged for the current active date.
3.  `previousHistory`: A chronological array containing the previous seven days of progress logs.

```json
{
  "userProfile": {
    "userId": "string",
    "name": "string",
    "age": 0,
    "gender": "string",
    "height": 0,
    "weight": 0.0,
    "fitnessLevel": "string",
    "currentGoal": "string",
    "workoutPlan": {
      "planId": "string",
      "planName": "string",
      "frequencyPerWeek": 0,
      "targetCaloriesBurnPerSession": 0,
      "targetSleepPerNight": 0.0,
      "targetWaterPerDay": 0.0,
      "targetStepsPerDay": 0
    }
  },
  "todayProgress": {
    "date": "YYYY-MM-DD",
    "workoutCompleted": true,
    "workoutType": "string",
    "workoutDuration": 0,
    "caloriesBurned": 0,
    "caloriesConsumed": 0,
    "steps": 0,
    "sleepHours": 0.0,
    "waterIntake": 0.0,
    "mood": "string",
    "energyLevel": 0,
    "injury": {
      "hasInjury": true,
      "painLevel": 0,
      "details": "string"
    },
    "notes": "string"
  },
  "previousHistory": [
    {
      "date": "YYYY-MM-DD",
      "workoutCompleted": true,
      "workoutType": "string",
      "workoutDuration": 0,
      "caloriesBurned": 0,
      "caloriesConsumed": 0,
      "steps": 0,
      "sleepHours": 0.0,
      "waterIntake": 0.0,
      "mood": "string",
      "energyLevel": 0,
      "injury": {
        "hasInjury": true,
        "painLevel": 0,
        "details": "string"
      }
    }
  ]
}
```

---

### 2. Field Specifications, Descriptions & Validation Rules

| JSON Path | Data Type | Requirement | Validation Rules | Description |
| :--- | :--- | :--- | :--- | :--- |
| **`userProfile`** | Object | **Required** | Must not be empty. | Houses static demographic and benchmark details. |
| `userProfile.userId` | String | **Required** | Non-empty alphanumeric string. | Unique identifier of the user in the database. |
| `userProfile.name` | String | Optional | Non-empty string; length <= 50. | Display name of the user. |
| `userProfile.age` | Integer | **Required** | Range: `13` to `120`. | User's age in years. Used to calculate metabolic rates. |
| `userProfile.gender` | String | **Required** | Enumerated: `["Male", "Female", "Non-binary", "Prefer not to say"]`. | Biological or self-reported gender for caloric algorithms. |
| `userProfile.height` | Integer | **Required** | Range: `100` to `250` (in cm). | Height baseline. |
| `userProfile.weight` | Float | **Required** | Range: `30.0` to `300.0` (in kg). | Current weight baseline. Used for caloric load adjustments. |
| `userProfile.fitnessLevel`| String | **Required** | Enumerated: `["Beginner", "Intermediate", "Advanced"]`. | The baseline athletic profile of the user. |
| `userProfile.currentGoal` | String | **Required** | Enumerated: `["Muscle Gain", "Fat Loss", "Endurance", "Maintenance"]`. | The targeted outcome of the current training cycle. |
| `userProfile.workoutPlan` | Object | **Required** | Must not be empty. | Configuration of the user's assigned active plan. |
| `userProfile.workoutPlan.planId` | String | **Required** | Alphanumeric string. | Unique identifier of the training schedule. |
| `userProfile.workoutPlan.planName` | String | Optional | String; length <= 100. | Name of the active program (e.g. "Hypertrophy Push-Pull"). |
| `userProfile.workoutPlan.frequencyPerWeek` | Integer | **Required** | Range: `1` to `7`. | Planned number of workout sessions per week. |
| `userProfile.workoutPlan.targetCaloriesBurnPerSession` | Integer | **Required** | Range: `100` to `2000`. | Benchmark caloric expenditure targeted per workout. |
| `userProfile.workoutPlan.targetSleepPerNight` | Float | **Required** | Range: `5.0` to `12.0`. | Optimal target sleep duration (hours) for recovery. |
| `userProfile.workoutPlan.targetWaterPerDay` | Float | **Required** | Range: `1.5` to `6.0`. | Target hydration intake (liters) for standard recovery. |
| `userProfile.workoutPlan.targetStepsPerDay` | Integer | **Required** | Range: `1000` to `50000`. | Minimum daily step goal. |
| **`todayProgress`** | Object | **Required** | Must not be empty. | Metrics recorded for the active date. |
| `todayProgress.date` | String | **Required** | ISO Format: `YYYY-MM-DD`. | Calendar date of today's progress log. |
| `todayProgress.workoutCompleted` | Boolean | **Required** | `true` or `false`. | Indicator of whether a physical workout was done today. |
| `todayProgress.workoutType` | String | Conditional | Required if `workoutCompleted` is `true`. Length <= 50. | Specific muscle group/discipline (e.g., "Chest", "Legs", "Cardio"). |
| `todayProgress.workoutDuration` | Integer | Conditional | Required if `workoutCompleted` is `true`. Range: `5` to `360` (mins). | Time spent active in the physical training session. |
| `todayProgress.caloriesBurned` | Integer | Conditional | Required if `workoutCompleted` is `true`. Range: `0` to `3000`. | Total active calories burned from workouts. |
| `todayProgress.caloriesConsumed` | Integer | **Required** | Range: `0` to `10000` (kcal). | Daily dietary caloric intake. |
| `todayProgress.steps` | Integer | **Required** | Range: `0` to `100000`. | Total pedometer count logged for the day. |
| `todayProgress.sleepHours` | Float | **Required** | Range: `0.0` to `24.0`. | Actual sleep duration recorded the previous night. |
| `todayProgress.waterIntake` | Float | **Required** | Range: `0.0` to `15.0` (liters). | Quantity of water consumed during today's logging window. |
| `todayProgress.mood` | String | **Required** | Enumerated: `["Energetic", "Good", "Tired", "Exhausted", "Stressed"]`. | Subjective cognitive status logged by the user. |
| `todayProgress.energyLevel` | Integer | **Required** | Range: `1` to `10`. | Subjective physical energy level baseline. |
| `todayProgress.injury` | Object | **Required** | Must not be empty. | Sub-structure tracking pain and localized distress. |
| `todayProgress.injury.hasInjury` | Boolean | **Required** | `true` or `false`. | Whether the user reports active injury/pain. |
| `todayProgress.injury.painLevel` | Integer | Conditional | Required if `hasInjury` is `true`. Range: `0` to `10`. | Pain scale mapping. |
| `todayProgress.injury.details` | String | Optional | String; length <= 250. | Detailed explanation of pain location or movement limits. |
| `todayProgress.notes` | String | Optional | String; length <= 500. | Open-text thoughts, performance notes, or soreness indicators. |
| **`previousHistory`** | Array | **Required** | Array size: `0` to `7`. | Sorted chronologically by date descending. |

---

### 3. Sample Payload JSON

Here is a fully hydrated sample input representing user "Rahul" logging a workout day:

```json
{
  "userProfile": {
    "userId": "USR001",
    "name": "Rahul",
    "age": 22,
    "gender": "Male",
    "height": 175,
    "weight": 72.5,
    "fitnessLevel": "Beginner",
    "currentGoal": "Muscle Gain",
    "workoutPlan": {
      "planId": "PLAN-HYP-01",
      "planName": "Push-Pull-Legs Routine",
      "frequencyPerWeek": 4,
      "targetCaloriesBurnPerSession": 400,
      "targetSleepPerNight": 8.0,
      "targetWaterPerDay": 3.0,
      "targetStepsPerDay": 8000
    }
  },
  "todayProgress": {
    "date": "2026-07-22",
    "workoutCompleted": true,
    "workoutType": "Chest & Triceps",
    "workoutDuration": 65,
    "caloriesBurned": 450,
    "caloriesConsumed": 2800,
    "steps": 9200,
    "sleepHours": 6.5,
    "waterIntake": 2.2,
    "mood": "Tired",
    "energyLevel": 5,
    "injury": {
      "hasInjury": true,
      "painLevel": 3,
      "details": "Slight pinch in the front of left shoulder during bench press."
    },
    "notes": "Muscle strength was solid, but felt fatigued in the final sets. Left shoulder felt a bit tender on high volumes."
  },
  "previousHistory": [
    {
      "date": "2026-07-21",
      "workoutCompleted": true,
      "workoutType": "Back & Biceps",
      "workoutDuration": 60,
      "caloriesBurned": 420,
      "caloriesConsumed": 2950,
      "steps": 8500,
      "sleepHours": 7.5,
      "waterIntake": 3.1,
      "mood": "Energetic",
      "energyLevel": 8,
      "injury": {
        "hasInjury": false,
        "painLevel": 0
      }
    },
    {
      "date": "2026-07-20",
      "workoutCompleted": false,
      "workoutType": null,
      "workoutDuration": 0,
      "caloriesBurned": 0,
      "caloriesConsumed": 2400,
      "steps": 4500,
      "sleepHours": 8.0,
      "waterIntake": 2.8,
      "mood": "Good",
      "energyLevel": 7,
      "injury": {
        "hasInjury": false,
        "painLevel": 0
      }
    },
    {
      "date": "2026-07-19",
      "workoutCompleted": true,
      "workoutType": "Legs",
      "workoutDuration": 55,
      "caloriesBurned": 500,
      "caloriesConsumed": 3100,
      "steps": 10500,
      "sleepHours": 8.5,
      "waterIntake": 3.5,
      "mood": "Energetic",
      "energyLevel": 9,
      "injury": {
        "hasInjury": false,
        "painLevel": 0
      }
    }
  ]
}
```

---

### 4. Architectural Value of Each Field for AI Analysis

The AI does not treat fields as simple static readouts. Instead, it runs them through a correlative matrix to provide dynamic insights:

#### Demographic Metrics (`age`, `gender`, `height`, `weight`)
*   **Baselines**: Used to compute expected Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE).
*   **Goal Suitability**: Evaluates if the logged workout duration and food intake (`caloriesConsumed`) are biochemically aligned with their demographics (e.g., a 22-year-old male beginner trying to build muscle requires different caloric thresholds than an older maintenance user).

#### Current Goal & Fitness Level (`currentGoal`, `fitnessLevel`)
*   **Contextual Guardrails**: Defines the analysis filter. For a "Beginner" focused on "Muscle Gain", the AI will penalize high-intensity multi-hour workouts as high injury risk (overtraining), whereas for an "Advanced" athlete, it would treat it as standard volume.

#### Workout Plan Constraints (`workoutPlan` object)
*   **Target Baselines**: The AI references the plan targets (`targetSleepPerNight`, `targetWaterPerDay`, `frequencyPerWeek`) to compute user variance. If water intake falls below the plan's baseline, it triggers a "hydration bottleneck" vulnerability alert.

#### Workout Completion & Metrics (`workoutCompleted`, `workoutType`, `workoutDuration`, `caloriesBurned`)
*   **Consistency Analysis**: Evaluates calendar intervals. Consecutive training sessions without rest days can trigger safety warnings.
*   **Volume & Density Evaluation**: Correlates duration against calorie burn to estimate workout intensity.

#### Dietary & Metabolic Balance (`caloriesConsumed`, `caloriesBurned`, `steps`)
*   **Energy Deficit/Surplus Modeling**: Compares target goals with net energy equations. For example, if the goal is "Muscle Gain", but net calories (`caloriesConsumed` minus active and basal burn) are negative, the AI flags a "Caloric Deficit" vulnerability.
*   **Basal vs Active Steps**: Evaluates non-workout activity levels (`steps`) to monitor cardiovascular recovery and general daily movement.

#### Sleep & Recovery (`sleepHours`)
*   **Systemic Recovery Index**: Analyzed in tandem with performance. A decline in sleep duration compared to historical targets is matched against subsequent performance decreases (e.g., if sleep drops by 20%, does energy level drop by 30%?).

#### Hydration (`waterIntake`)
*   **Hydration/Fatigue Correlation**: Low hydration values are evaluated alongside reported pain levels and energy levels. Dehydration is known to compound muscle soreness (DOMS) and physical fatigue.

#### Subjective Metrics (`mood`, `energyLevel`, `notes`)
*   **CNS (Central Nervous System) Fatigue Indicators**: Fluctuations in mood (e.g., "Energetic" to "Exhausted") and energy scores provide the subjective feedback loop that numbers miss.
*   **Semantic Parsing**: The AI reads user `notes` using Natural Language Processing (NLP) to detect signs of joint stiffness, exhaustion, or emotional demotivation.

#### Safety and Injury Management (`injury` object containing `hasInjury`, `painLevel`, `details`)
*   **Injury Risk Classification**: Pain levels above 4 on back-to-back workout days force the AI to mark `injuryRisk.level` as "High" and restrict high-intensity exercises in the recommendation feed.
*   **Feedback Loops**: By comparing the current day's pain level with historical pain data, the AI notes recovery trends (e.g., *"Pain in shoulder decreased from 5 to 3 over 3 days"*).