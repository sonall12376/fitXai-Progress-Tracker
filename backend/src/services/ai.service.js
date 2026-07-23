"use strict";
/**
 * AI Service Integration Placeholder
 *
 * Note for team members:
 * This service is responsible for formatting database rows into the `AI_INPUT.MD` format,
 * invoking the Gemini AI API, and returning the structured JSON response as defined in
 * `AI_OUTPUT.MD`.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
class AiService {
    /**
     * Generates a progress report via Gemini AI.
     * Currently, this is a mock implementation that returns a fake payload
     * matching the expected contract structure.
     *
     * @param userProfile The user's profile and settings.
     * @param historicalLogs Up to 7 days of recent progress logs.
     * @param todayLog Today's submitted progress log.
     */
    static generateReport(userProfile, historicalLogs, todayLog) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Replace this mock block with actual @google/genai integration
            // Simulate API delay
            yield new Promise(resolve => setTimeout(resolve, 1000));
            // Fallback/Mock Response returning AI_OUTPUT.MD schema
            return {
                progressScore: 85,
                confidenceScore: 0.95,
                consistencyAnalysis: {
                    status: "On Track",
                    completedWorkoutsCount: 5,
                    missedWorkoutsCount: 1,
                    weeklyAdherencePercentage: 83.3
                },
                workoutPerformance: {
                    intensityLevel: "Moderate",
                    caloriesBurnedVariance: 12.5,
                    durationVariance: 5.0,
                    feedback: "Solid effort today. You hit your target metrics."
                },
                recoveryAnalysis: {
                    status: "Adequate",
                    sleepQuality: "Good",
                    hydrationStatus: "Sub-optimal",
                    fatigueLevel: "Low",
                    insights: [
                        "Water intake was slightly below your target."
                    ]
                },
                injuryRisk: {
                    riskLevel: "Low",
                    criticalAreas: [],
                    preventativeAction: ""
                },
                userVulnerabilities: [
                    "Hydration is below optimal levels."
                ],
                improvementAnalysis: {
                    isImproving: true,
                    metricChanges: [
                        "Duration is up by 5% over last week."
                    ],
                    primaryBottleneck: "Dehydration is slowing metabolic recovery."
                },
                goalProgress: {
                    status: "On Track",
                    estimatedWeeksToGoal: 12,
                    qualitativeAssessment: "Steady progression."
                },
                personalizedRecommendations: [
                    {
                        category: "Recovery",
                        priority: "High",
                        action: "Increase water intake to 3.0 liters.",
                        rationale: "Compensates for workout sweating."
                    }
                ],
                motivationMessage: "Excellent workout today! Keep up this consistency."
            };
        });
    }
}
exports.AiService = AiService;
