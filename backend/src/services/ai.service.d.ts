/**
 * AI Service Integration Placeholder
 *
 * Note for team members:
 * This service is responsible for formatting database rows into the `AI_INPUT.MD` format,
 * invoking the Gemini AI API, and returning the structured JSON response as defined in
 * `AI_OUTPUT.MD`.
 */
export declare class AiService {
    /**
     * Generates a progress report via Gemini AI.
     * Currently, this is a mock implementation that returns a fake payload
     * matching the expected contract structure.
     *
     * @param userProfile The user's profile and settings.
     * @param historicalLogs Up to 7 days of recent progress logs.
     * @param todayLog Today's submitted progress log.
     */
    static generateReport(userProfile: any, historicalLogs: any[], todayLog: any): Promise<{
        progressScore: number;
        confidenceScore: number;
        consistencyAnalysis: {
            status: string;
            completedWorkoutsCount: number;
            missedWorkoutsCount: number;
            weeklyAdherencePercentage: number;
        };
        workoutPerformance: {
            intensityLevel: string;
            caloriesBurnedVariance: number;
            durationVariance: number;
            feedback: string;
        };
        recoveryAnalysis: {
            status: string;
            sleepQuality: string;
            hydrationStatus: string;
            fatigueLevel: string;
            insights: string[];
        };
        injuryRisk: {
            riskLevel: string;
            criticalAreas: never[];
            preventativeAction: string;
        };
        userVulnerabilities: string[];
        improvementAnalysis: {
            isImproving: boolean;
            metricChanges: string[];
            primaryBottleneck: string;
        };
        goalProgress: {
            status: string;
            estimatedWeeksToGoal: number;
            qualitativeAssessment: string;
        };
        personalizedRecommendations: {
            category: string;
            priority: string;
            action: string;
            rationale: string;
        }[];
        motivationMessage: string;
    }>;
}
//# sourceMappingURL=ai.service.d.ts.map