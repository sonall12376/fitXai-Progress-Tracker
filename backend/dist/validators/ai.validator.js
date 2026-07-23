"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiValidator = exports.AiOutputSchema = exports.AiGoalProgressSchema = exports.AiImprovementAnalysisSchema = exports.AiInjuryRiskSchema = exports.AiRecoveryAnalysisSchema = exports.AiWorkoutPerformanceSchema = exports.AiConsistencyAnalysisSchema = exports.AiRecommendationSchema = void 0;
const zod_1 = require("zod");
// ==========================================
// 1. ZOD ENUM DEFINITIONS (Matching AI_OUTPUT.md)
// ==========================================
const ConsistencyStatusEnum = zod_1.z.enum(['Excellent', 'On Track', 'Needs Attention', 'Unsatisfactory']);
const IntensityLevelEnum = zod_1.z.enum(['High', 'Moderate', 'Low']);
const RecoveryStatusEnum = zod_1.z.enum(['Optimal', 'Adequate', 'Impaired', 'Critical']);
const SleepQualityEnum = zod_1.z.enum(['Good', 'Fair', 'Poor']);
const HydrationStatusEnum = zod_1.z.enum(['Optimal', 'Sub-optimal', 'Critical']);
const FatigueLevelEnum = zod_1.z.enum(['Low', 'Medium', 'High']);
const RiskLevelEnum = zod_1.z.enum(['Low', 'Moderate', 'High']);
const GoalStatusEnum = zod_1.z.enum(['Ahead of Plan', 'On Track', 'Behind Plan', 'Stagnant']);
const CategoryEnum = zod_1.z.enum(['Workout', 'Diet', 'Recovery', 'Safety']);
const PriorityEnum = zod_1.z.enum(['High', 'Medium', 'Low']);
// ==========================================
// 2. ZOD SUB-SCHEMAS WITH DEFENSIVE FALLBACKS
// ==========================================
exports.AiRecommendationSchema = zod_1.z.object({
    category: CategoryEnum.catch('Recovery'),
    priority: PriorityEnum.catch('Medium'),
    action: zod_1.z.string().catch('Maintain a balanced routine and stay hydrated.'),
    rationale: zod_1.z.string().catch('Supports daily recovery and metabolic function.')
});
exports.AiConsistencyAnalysisSchema = zod_1.z.object({
    status: ConsistencyStatusEnum.catch('On Track'),
    completedWorkoutsCount: zod_1.z.number().catch(0),
    missedWorkoutsCount: zod_1.z.number().catch(0),
    weeklyAdherencePercentage: zod_1.z.number().catch(0.0)
}).catch({
    status: 'On Track',
    completedWorkoutsCount: 0,
    missedWorkoutsCount: 0,
    weeklyAdherencePercentage: 0.0
});
exports.AiWorkoutPerformanceSchema = zod_1.z.object({
    intensityLevel: IntensityLevelEnum.catch('Moderate'),
    caloriesBurnedVariance: zod_1.z.number().catch(0.0),
    durationVariance: zod_1.z.number().catch(0.0),
    feedback: zod_1.z.string().catch('Workout recorded successfully.')
}).catch({
    intensityLevel: 'Moderate',
    caloriesBurnedVariance: 0.0,
    durationVariance: 0.0,
    feedback: 'Workout recorded successfully.'
});
exports.AiRecoveryAnalysisSchema = zod_1.z.object({
    status: RecoveryStatusEnum.catch('Adequate'),
    sleepQuality: SleepQualityEnum.catch('Fair'),
    hydrationStatus: HydrationStatusEnum.catch('Sub-optimal'),
    fatigueLevel: FatigueLevelEnum.catch('Medium'),
    insights: zod_1.z.array(zod_1.z.string()).catch(['Ensure adequate water and sleep for proper recovery.'])
}).catch({
    status: 'Adequate',
    sleepQuality: 'Fair',
    hydrationStatus: 'Sub-optimal',
    fatigueLevel: 'Medium',
    insights: ['Ensure adequate water and sleep for proper recovery.']
});
exports.AiInjuryRiskSchema = zod_1.z.object({
    riskLevel: RiskLevelEnum.catch('Low'),
    criticalAreas: zod_1.z.array(zod_1.z.string()).catch([]),
    preventativeAction: zod_1.z.string().catch('')
}).catch({
    riskLevel: 'Low',
    criticalAreas: [],
    preventativeAction: ''
});
exports.AiImprovementAnalysisSchema = zod_1.z.object({
    isImproving: zod_1.z.boolean().catch(true),
    metricChanges: zod_1.z.array(zod_1.z.string()).catch(['Baseline metrics active.']),
    primaryBottleneck: zod_1.z.string().catch('None identified.')
}).catch({
    isImproving: true,
    metricChanges: ['Baseline metrics active.'],
    primaryBottleneck: 'None identified.'
});
exports.AiGoalProgressSchema = zod_1.z.object({
    status: GoalStatusEnum.catch('On Track'),
    estimatedWeeksToGoal: zod_1.z.number().nullable().catch(null),
    qualitativeAssessment: zod_1.z.string().catch('Progressing steadily towards fitness goal.')
}).catch({
    status: 'On Track',
    estimatedWeeksToGoal: null,
    qualitativeAssessment: 'Progressing steadily towards fitness goal.'
});
// ==========================================
// 3. MASTER AI OUTPUT SCHEMA
// ==========================================
exports.AiOutputSchema = zod_1.z.object({
    progressScore: zod_1.z.number().catch(75),
    confidenceScore: zod_1.z.number().catch(0.85),
    consistencyAnalysis: exports.AiConsistencyAnalysisSchema,
    workoutPerformance: exports.AiWorkoutPerformanceSchema,
    recoveryAnalysis: exports.AiRecoveryAnalysisSchema,
    injuryRisk: exports.AiInjuryRiskSchema,
    userVulnerabilities: zod_1.z.array(zod_1.z.string()).catch([]),
    improvementAnalysis: exports.AiImprovementAnalysisSchema,
    goalProgress: exports.AiGoalProgressSchema,
    personalizedRecommendations: zod_1.z.array(exports.AiRecommendationSchema).catch([
        {
            category: 'Recovery',
            priority: 'High',
            action: 'Drink at least 2.5 to 3.0 Liters of water daily.',
            rationale: 'Adequate hydration accelerates post-workout recovery and prevents cramping.'
        }
    ]),
    motivationMessage: zod_1.z.string().catch('Great effort today! Keep pushing consistently towards your goals.')
});
/**
 * Multi-Gate Response Validation and Sanitization Service for AI Outputs.
 */
class AiValidator {
    /**
     * Gate 1: Sanitizes markdown code fences, removes trailing commentary,
     * and extracts the root JSON string '{ ... }'.
     */
    static sanitizeJsonText(rawText) {
        if (!rawText || typeof rawText !== 'string')
            return '{}';
        let text = rawText.trim();
        // Strip markdown code block wrappers (e.g. ```json ... ```)
        text = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '');
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            return text.substring(firstBrace, lastBrace + 1);
        }
        return text;
    }
    /**
     * Gate 2 & Gate 3: Parses JSON, validates structure, clamps numerical bounds,
     * and guarantees fallbacks matching AI_OUTPUT.md specification.
     *
     * @param rawText - Raw text string output from Gemini AI
     * @returns Cleaned and validated AiOutputPayload
     */
    static validateAndClean(rawText) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        // ---------------------------------------
        // Gate 1: Sanitize text
        // ---------------------------------------
        const cleanJson = this.sanitizeJsonText(rawText);
        // ---------------------------------------
        // Gate 2: Parse JSON
        // ---------------------------------------
        let parsed;
        try {
            parsed = JSON.parse(cleanJson);
        }
        catch (err) {
            throw new Error(`JSON_PARSE_ERROR: Failed to parse AI output. ${err.message}`);
        }
        // ---------------------------------------
        // Compatibility mappings
        // Handles old Gemini field names
        // ---------------------------------------
        if (!parsed.personalizedRecommendations && parsed.recommendations) {
            parsed.personalizedRecommendations = parsed.recommendations;
        }
        if (!parsed.goalProgress && parsed.goalPathing) {
            parsed.goalProgress = {
                status: parsed.goalPathing.isAligningWithGoal
                    ? "On Track"
                    : "Behind Plan",
                estimatedWeeksToGoal: (_a = parsed.goalPathing.estimatedWeeksToGoal) !== null && _a !== void 0 ? _a : null,
                qualitativeAssessment: (_b = parsed.goalPathing.paceAssessment) !== null && _b !== void 0 ? _b : "Progressing towards goal."
            };
        }
        if (!parsed.workoutPerformance && parsed.performanceVariance) {
            parsed.workoutPerformance = {
                intensityLevel: "Moderate",
                caloriesBurnedVariance: (_c = parsed.performanceVariance.caloriesBurnedVariance) !== null && _c !== void 0 ? _c : 0,
                durationVariance: (_d = parsed.performanceVariance.durationVariance) !== null && _d !== void 0 ? _d : 0,
                feedback: "Workout analyzed successfully."
            };
        }
        // ---------------------------------------
        // Ensure required nested objects exist
        // ---------------------------------------
        (_e = parsed.consistencyAnalysis) !== null && _e !== void 0 ? _e : (parsed.consistencyAnalysis = {});
        (_f = parsed.workoutPerformance) !== null && _f !== void 0 ? _f : (parsed.workoutPerformance = {});
        (_g = parsed.recoveryAnalysis) !== null && _g !== void 0 ? _g : (parsed.recoveryAnalysis = {});
        (_h = parsed.injuryRisk) !== null && _h !== void 0 ? _h : (parsed.injuryRisk = {});
        (_j = parsed.improvementAnalysis) !== null && _j !== void 0 ? _j : (parsed.improvementAnalysis = {});
        (_k = parsed.goalProgress) !== null && _k !== void 0 ? _k : (parsed.goalProgress = {});
        (_l = parsed.personalizedRecommendations) !== null && _l !== void 0 ? _l : (parsed.personalizedRecommendations = []);
        (_m = parsed.userVulnerabilities) !== null && _m !== void 0 ? _m : (parsed.userVulnerabilities = []);
        // ---------------------------------------
        // Normalize confidence score
        // Gemini sometimes returns 92 instead of 0.92
        // ---------------------------------------
        if (typeof parsed.confidenceScore === "number" &&
            parsed.confidenceScore > 1) {
            parsed.confidenceScore = parsed.confidenceScore / 100;
        }
        // ---------------------------------------
        // Gate 3: Zod validation
        // ---------------------------------------
        const validated = exports.AiOutputSchema.parse(parsed);
        // ---------------------------------------
        // Gate 4: Clamp numeric values
        // ---------------------------------------
        validated.progressScore = Math.max(0, Math.min(100, Math.round(validated.progressScore)));
        validated.confidenceScore = Math.max(0, Math.min(1, Number(validated.confidenceScore.toFixed(2))));
        validated.consistencyAnalysis.completedWorkoutsCount = Math.max(0, Math.min(7, Math.round(validated.consistencyAnalysis.completedWorkoutsCount)));
        validated.consistencyAnalysis.missedWorkoutsCount = Math.max(0, Math.min(7, Math.round(validated.consistencyAnalysis.missedWorkoutsCount)));
        validated.consistencyAnalysis.weeklyAdherencePercentage = Math.max(0, Math.min(100, Number(validated.consistencyAnalysis.weeklyAdherencePercentage.toFixed(1))));
        validated.workoutPerformance.caloriesBurnedVariance = Math.max(-100, Math.min(500, Number(validated.workoutPerformance.caloriesBurnedVariance.toFixed(1))));
        validated.workoutPerformance.durationVariance = Math.max(-100, Math.min(500, Number(validated.workoutPerformance.durationVariance.toFixed(1))));
        if (validated.goalProgress.estimatedWeeksToGoal != null) {
            validated.goalProgress.estimatedWeeksToGoal = Math.max(1, Math.min(104, Math.round(validated.goalProgress.estimatedWeeksToGoal)));
        }
        // ---------------------------------------
        // Ensure recommendations are never empty
        // ---------------------------------------
        if (validated.personalizedRecommendations.length === 0) {
            validated.personalizedRecommendations = [
                {
                    category: "Recovery",
                    priority: "High",
                    action: "Ensure 7–8 hours of quality sleep tonight.",
                    rationale: "Proper sleep improves muscle recovery and overall performance."
                }
            ];
        }
        return validated;
    }
}
exports.AiValidator = AiValidator;
