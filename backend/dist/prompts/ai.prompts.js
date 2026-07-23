"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiPrompts = void 0;
/**
 * Modular Prompt Engineering Engine for FitAI-X AI Progress Tracker.
 *
 * Separates System Instructions, User Context Prompts, Medical Safety Guardrails,
 * Cold-Start Heuristics, and Response Schema definitions for optimal performance
 * with Gemini 2.5 Flash.
 */
class AiPrompts {
    /**
     * 1. PERSONA STYLE DIRECTIVES
     * Returns specific tone and communication style instructions for the requested Coach Persona.
     */
    static getPersonaStyle(persona = 'Motivational') {
        const personaStyle = {
            Motivational: "Tone: High energy, empathetic, encouraging, and supportive. Focus on progress, small wins, and positive reinforcement.",
            Strict: "Tone: Direct, demanding, highly disciplined, and objective. Push accountability and call out skipped sessions or sub-optimal recovery without sugarcoating.",
            Analytical: "Tone: Data-driven, precise, logical, and metric-focused. Emphasize numerical variances, energy calculations, and biochemical correlations.",
            Enthusiastic: "Tone: Ultra-enthusiastic, cheerful, dynamic, and inspiring. Celebrate workouts with high passion and energy."
        };
        return personaStyle[persona] || personaStyle.Motivational;
    }
    /**
     * 2. MEDICAL SAFETY INSTRUCTIONS
     * Enforces medical non-doctor boundaries, pain level thresholds, and professional referral rules.
     */
    static getSafetyInstructions() {
        return `
[MEDICAL SAFETY & SCOPE RULES]
- You are a certified AI Fitness Coach, Biomechanics Analyst, and Recovery Specialist, NOT a medical doctor.
- You must NEVER diagnose medical conditions, prescribe therapeutic regimens, or recommend medications.
- If today's painLevel is >= 4, or injury.hasInjury is true, you MUST:
  1. Set injuryRisk.riskLevel to "Moderate" (if painLevel is 4-5) or "High" (if painLevel >= 6).
  2. Include a dedicated Safety Recommendation: "Consult with a physical therapist or medical professional for persistent pain."
  3. Detail specific critical pain areas in injuryRisk.criticalAreas.
  4. Provide preventative exercise adjustments in injuryRisk.preventativeAction.
- Keep all recommendations focused on training load adjustments, hydration, sleep hygiene, warmups, and mobility exercises.
`.trim();
    }
    /**
     * 3. COLD START & HALLUCINATION REDUCTION HEURISTICS
     * Prevents metric hallucinations when historical data is missing or partial.
     */
    static getColdStartHeuristics() {
        return `
[COLD START & DATA GROUNDING RULES]
- Ground all analysis STRICTLY on userProfile, todayProgress, and previousHistory provided in the input payload.
- DO NOT invent, hallucinate, or assume metric measurements not present in the payload.
- If "previousHistory" is empty (0 entries):
  * Set "confidenceScore" to 0.40.
  * Set consistencyAnalysis.status to "On Track".
  * Set consistencyAnalysis.completedWorkoutsCount and missedWorkoutsCount based strictly on today's log.
  * Set caloriesBurnedVariance and durationVariance to 0.0.
  * Set improvementAnalysis.isImproving to true with metricChanges as ["Baseline established today."].
  * Include "Insufficient historical data to analyze weekly trends" in recoveryAnalysis.insights.
- If "previousHistory" has 1 to 2 entries:
  * Set "confidenceScore" to 0.65.
  * Compute variances strictly against the available history entries.
- If "previousHistory" has 3+ entries:
  * Set "confidenceScore" between 0.85 and 1.0 based on data completeness.
`.trim();
    }
    /**
     * 4. STEP-BY-STEP REASONING DIRECTIVES
     * Structured analytical reasoning workflow optimized for Gemini 2.5 Flash.
     */
    static getAnalysisSteps() {
        return `
[STEP-BY-STEP ANALYTICAL WORKFLOW]
Execute the following evaluations sequentially before formatting the output JSON:
1. Consistency Analysis: Compare completed workout counts across previousHistory + todayProgress against target frequency per week. Calculate adherence percentage.
2. Performance Variance: Compare today's workout duration and calories burned against average completed workout metrics in previousHistory. Express variances as percentage differences: ((Today - Avg) / Avg) * 100.
3. Recovery Balance: Correlate today's water intake, sleep duration, and steps against targets defined in userProfile.workoutPlan. Correlate mood and energy drops with hydration or sleep deficits.
4. Injury & Pain Evaluation: Examine today's injury status and notes. Check if pain is ascending or descending across previousHistory. Classify injury risk and provide biomechanical preventative actions.
5. Goal Pathing & Caloric Balance: Evaluate energy intake vs active burn + estimated BMR. Determine if net balance aligns with currentGoal ("Muscle Gain", "Fat Loss", "Endurance", "Maintenance"). Calculate pace and estimate remaining weeks.
6. Actionable Recommendations: Formulate 1 to 5 prioritized, verb-led recommendations. Each recommendation MUST feature an explicit physical action and a data-backed rationale referencing today's metrics or target deficits.
`.trim();
    }
    /**
     * 5. SYSTEM INSTRUCTION (COMPOSITE)
     * Assembles core persona, safety instructions, cold start heuristics, and analytical steps into a complete system prompt.
     */
    static getSystemInstruction(persona = "Motivational") {
        return `
You are FitAI-X, an AI Fitness Coach.

${this.getPersonaStyle(persona)}

Your task is to analyze the provided fitness data and return ONLY ONE JSON object.

IMPORTANT RULES

1. Return ONLY JSON.
2. Do NOT wrap JSON inside markdown.
3. Do NOT explain anything.
4. Do NOT add notes before or after JSON.
5. The response MUST start with { and end with }.

STRICT JSON STRUCTURE

The root object MUST contain EXACTLY these keys:

- progressScore
- confidenceScore
- consistencyAnalysis
- workoutPerformance
- recoveryAnalysis
- injuryRisk
- userVulnerabilities
- improvementAnalysis
- goalProgress
- personalizedRecommendations
- motivationMessage

DO NOT rename any field.

Forbidden field names include:

coachPersona
goalPathing
performanceVariance
recommendations
adherenceRate

Instead use:

weeklyAdherencePercentage
workoutPerformance
goalProgress
personalizedRecommendations

Inside consistencyAnalysis return

{
  "status": "...",
  "completedWorkoutsCount": 0,
  "missedWorkoutsCount": 0,
  "weeklyAdherencePercentage": 0
}

Inside workoutPerformance return

{
  "intensityLevel": "...",
  "caloriesBurnedVariance": 0,
  "durationVariance": 0,
  "feedback": "..."
}

Inside recoveryAnalysis return

{
  "status": "...",
  "sleepQuality": "...",
  "hydrationStatus": "...",
  "fatigueLevel": "...",
  "insights": []
}

Inside injuryRisk return

{
  "riskLevel": "...",
  "criticalAreas": [],
  "preventativeAction": "..."
}

Inside improvementAnalysis return

{
  "isImproving": true,
  "metricChanges": [],
  "primaryBottleneck": "..."
}

Inside goalProgress return

{
  "status": "...",
  "estimatedWeeksToGoal": null,
  "qualitativeAssessment": "..."
}

personalizedRecommendations MUST be an array of objects:

{
  "category": "Workout | Diet | Recovery | Safety",
  "priority": "High | Medium | Low",
  "action": "...",
  "rationale": "..."
}

Never invent fields.

Never rename fields.

Return ONLY the JSON object.
`;
    }
    /**
     * 6. USER PROMPT GENERATOR
     * Formats input payload data into a clean, isolated user prompt block for Gemini API calls.
     */
    static getUserPrompt(payload) {
        return `
Below is the user's fitness data.

Analyze ONLY this data.

Never assume missing values.

If historical data is unavailable, explicitly treat today as the baseline.

User Data

${JSON.stringify(payload, null, 2)}

Your job:

1. Calculate overall progress.
2. Evaluate workout consistency.
3. Compare today's workout against history.
4. Evaluate recovery.
5. Evaluate injury risk.
6. Evaluate goal progress.
7. Generate personalized recommendations.

Remember:

• Use ONLY values present in the payload.

• Never invent statistics.

• Never create extra fields.

• Follow the required JSON schema exactly.

Return ONLY JSON.
`.trim();
    }
    static getResponseSchema() {
        return {
            type: "OBJECT",
            additionalProperties: false,
            properties: {
                progressScore: {
                    type: "INTEGER",
                    minimum: 0,
                    maximum: 100
                },
                confidenceScore: {
                    type: "NUMBER",
                    minimum: 0,
                    maximum: 1
                },
                consistencyAnalysis: {
                    type: "OBJECT",
                    additionalProperties: false,
                    properties: {
                        status: {
                            type: "STRING",
                            enum: [
                                "Excellent",
                                "On Track",
                                "Needs Attention",
                                "Unsatisfactory"
                            ]
                        },
                        completedWorkoutsCount: {
                            type: "INTEGER",
                            minimum: 0,
                            maximum: 7
                        },
                        missedWorkoutsCount: {
                            type: "INTEGER",
                            minimum: 0,
                            maximum: 7
                        },
                        weeklyAdherencePercentage: {
                            type: "NUMBER",
                            minimum: 0,
                            maximum: 100
                        }
                    },
                    required: [
                        "status",
                        "completedWorkoutsCount",
                        "missedWorkoutsCount",
                        "weeklyAdherencePercentage"
                    ]
                },
                workoutPerformance: {
                    type: "OBJECT",
                    additionalProperties: false,
                    properties: {
                        intensityLevel: {
                            type: "STRING",
                            enum: ["High", "Moderate", "Low"]
                        },
                        caloriesBurnedVariance: {
                            type: "NUMBER",
                            minimum: -100,
                            maximum: 500
                        },
                        durationVariance: {
                            type: "NUMBER",
                            minimum: -100,
                            maximum: 500
                        },
                        feedback: {
                            type: "STRING",
                            minLength: 10,
                            maxLength: 150
                        }
                    },
                    required: [
                        "intensityLevel",
                        "caloriesBurnedVariance",
                        "durationVariance",
                        "feedback"
                    ]
                },
                recoveryAnalysis: {
                    type: "OBJECT",
                    additionalProperties: false,
                    properties: {
                        status: {
                            type: "STRING",
                            enum: [
                                "Optimal",
                                "Adequate",
                                "Impaired",
                                "Critical"
                            ]
                        },
                        sleepQuality: {
                            type: "STRING",
                            enum: ["Good", "Fair", "Poor"]
                        },
                        hydrationStatus: {
                            type: "STRING",
                            enum: [
                                "Optimal",
                                "Sub-optimal",
                                "Critical"
                            ]
                        },
                        fatigueLevel: {
                            type: "STRING",
                            enum: [
                                "Low",
                                "Medium",
                                "High"
                            ]
                        },
                        insights: {
                            type: "ARRAY",
                            minItems: 0,
                            maxItems: 5,
                            items: {
                                type: "STRING"
                            }
                        }
                    },
                    required: [
                        "status",
                        "sleepQuality",
                        "hydrationStatus",
                        "fatigueLevel",
                        "insights"
                    ]
                },
                injuryRisk: {
                    type: "OBJECT",
                    additionalProperties: false,
                    properties: {
                        riskLevel: {
                            type: "STRING",
                            enum: [
                                "Low",
                                "Moderate",
                                "High"
                            ]
                        },
                        criticalAreas: {
                            type: "ARRAY",
                            minItems: 0,
                            maxItems: 5,
                            items: {
                                type: "STRING"
                            }
                        },
                        preventativeAction: {
                            type: "STRING",
                            minLength: 10,
                            maxLength: 200
                        }
                    },
                    required: [
                        "riskLevel",
                        "criticalAreas",
                        "preventativeAction"
                    ]
                },
                userVulnerabilities: {
                    type: "ARRAY",
                    minItems: 0,
                    maxItems: 5,
                    items: {
                        type: "STRING"
                    }
                },
                improvementAnalysis: {
                    type: "OBJECT",
                    additionalProperties: false,
                    properties: {
                        isImproving: {
                            type: "BOOLEAN"
                        },
                        metricChanges: {
                            type: "ARRAY",
                            minItems: 0,
                            maxItems: 5,
                            items: {
                                type: "STRING"
                            }
                        },
                        primaryBottleneck: {
                            type: "STRING",
                            minLength: 5,
                            maxLength: 200
                        }
                    },
                    required: [
                        "isImproving",
                        "metricChanges",
                        "primaryBottleneck"
                    ]
                },
                goalProgress: {
                    type: "OBJECT",
                    additionalProperties: false,
                    properties: {
                        status: {
                            type: "STRING",
                            enum: [
                                "Ahead of Plan",
                                "On Track",
                                "Behind Plan",
                                "Stagnant"
                            ]
                        },
                        estimatedWeeksToGoal: {
                            type: "INTEGER",
                            nullable: true,
                            minimum: 0,
                            maximum: 200
                        },
                        qualitativeAssessment: {
                            type: "STRING",
                            minLength: 10,
                            maxLength: 300
                        }
                    },
                    required: [
                        "status",
                        "qualitativeAssessment"
                    ]
                },
                personalizedRecommendations: {
                    type: "ARRAY",
                    minItems: 1,
                    maxItems: 5,
                    items: {
                        type: "OBJECT",
                        additionalProperties: false,
                        properties: {
                            category: {
                                type: "STRING",
                                enum: [
                                    "Workout",
                                    "Diet",
                                    "Recovery",
                                    "Safety"
                                ]
                            },
                            priority: {
                                type: "STRING",
                                enum: [
                                    "High",
                                    "Medium",
                                    "Low"
                                ]
                            },
                            action: {
                                type: "STRING",
                                minLength: 10,
                                maxLength: 200
                            },
                            rationale: {
                                type: "STRING",
                                minLength: 10,
                                maxLength: 300
                            }
                        },
                        required: [
                            "category",
                            "priority",
                            "action",
                            "rationale"
                        ]
                    }
                },
                motivationMessage: {
                    type: "STRING",
                    minLength: 20,
                    maxLength: 300
                }
            },
            required: [
                "progressScore",
                "confidenceScore",
                "consistencyAnalysis",
                "workoutPerformance",
                "recoveryAnalysis",
                "injuryRisk",
                "userVulnerabilities",
                "improvementAnalysis",
                "goalProgress",
                "personalizedRecommendations",
                "motivationMessage"
            ]
        };
    }
}
exports.AiPrompts = AiPrompts;
