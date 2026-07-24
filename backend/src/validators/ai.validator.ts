import { z } from 'zod';
import { AiOutputPayload } from '../types/ai.types';

// ==========================================
// 1. ZOD ENUM DEFINITIONS (Matching AI_OUTPUT.md)
// ==========================================
const ConsistencyStatusEnum = z.enum(['Excellent', 'On Track', 'Needs Attention', 'Unsatisfactory']);
const IntensityLevelEnum = z.enum(['High', 'Moderate', 'Low']);
const RecoveryStatusEnum = z.enum(['Optimal', 'Adequate', 'Impaired', 'Critical']);
const SleepQualityEnum = z.enum(['Good', 'Fair', 'Poor']);
const HydrationStatusEnum = z.enum(['Optimal', 'Sub-optimal', 'Critical']);
const FatigueLevelEnum = z.enum(['Low', 'Medium', 'High']);
const RiskLevelEnum = z.enum(['Low', 'Moderate', 'High']);
const GoalStatusEnum = z.enum(['Ahead of Plan', 'On Track', 'Behind Plan', 'Stagnant']);
const CategoryEnum = z.enum(['Workout', 'Diet', 'Recovery', 'Safety']);
const PriorityEnum = z.enum(['High', 'Medium', 'Low']);

// ==========================================
// 2. ZOD SUB-SCHEMAS WITH DEFENSIVE FALLBACKS
// ==========================================

export const AiRecommendationSchema = z.object({
  category: CategoryEnum.catch('Recovery'),
  priority: PriorityEnum.catch('Medium'),
  action: z.string().catch('Maintain a balanced routine and stay hydrated.'),
  rationale: z.string().catch('Supports daily recovery and metabolic function.')
});

export const AiConsistencyAnalysisSchema = z.object({
  status: ConsistencyStatusEnum.catch('On Track'),
  completedWorkoutsCount: z.number().catch(0),
  missedWorkoutsCount: z.number().catch(0),
  weeklyAdherencePercentage: z.number().catch(0.0)
}).catch({
  status: 'On Track',
  completedWorkoutsCount: 0,
  missedWorkoutsCount: 0,
  weeklyAdherencePercentage: 0.0
});

export const AiWorkoutPerformanceSchema = z.object({
  intensityLevel: IntensityLevelEnum.catch('Moderate'),
  caloriesBurnedVariance: z.number().catch(0.0),
  durationVariance: z.number().catch(0.0),
  feedback: z.string().catch('Workout recorded successfully.')
}).catch({
  intensityLevel: 'Moderate',
  caloriesBurnedVariance: 0.0,
  durationVariance: 0.0,
  feedback: 'Workout recorded successfully.'
});

export const AiRecoveryAnalysisSchema = z.object({
  status: RecoveryStatusEnum.catch('Adequate'),
  sleepQuality: SleepQualityEnum.catch('Fair'),
  hydrationStatus: HydrationStatusEnum.catch('Sub-optimal'),
  fatigueLevel: FatigueLevelEnum.catch('Medium'),
  insights: z.array(z.string()).catch(['Ensure adequate water and sleep for proper recovery.'])
}).catch({
  status: 'Adequate',
  sleepQuality: 'Fair',
  hydrationStatus: 'Sub-optimal',
  fatigueLevel: 'Medium',
  insights: ['Ensure adequate water and sleep for proper recovery.']
});

export const AiInjuryRiskSchema = z.object({
  riskLevel: RiskLevelEnum.catch('Low'),
  criticalAreas: z.array(z.string()).catch([]),
  preventativeAction: z.string().catch('')
}).catch({
  riskLevel: 'Low',
  criticalAreas: [],
  preventativeAction: ''
});

export const AiImprovementAnalysisSchema = z.object({
  isImproving: z.boolean().catch(true),
  metricChanges: z.array(z.string()).catch(['Baseline metrics active.']),
  primaryBottleneck: z.string().catch('None identified.')
}).catch({
  isImproving: true,
  metricChanges: ['Baseline metrics active.'],
  primaryBottleneck: 'None identified.'
});

export const AiGoalProgressSchema = z.object({
  status: GoalStatusEnum.catch('On Track'),
  estimatedWeeksToGoal: z.number().nullable().catch(null),
  qualitativeAssessment: z.string().catch('Progressing steadily towards fitness goal.')
}).catch({
  status: 'On Track',
  estimatedWeeksToGoal: null,
  qualitativeAssessment: 'Progressing steadily towards fitness goal.'
});

// ==========================================
// 3. MASTER AI OUTPUT SCHEMA
// ==========================================

export const AiOutputSchema = z.object({
  progressScore: z.number().catch(75),
  confidenceScore: z.number().catch(0.85),
  consistencyAnalysis: AiConsistencyAnalysisSchema,
  workoutPerformance: AiWorkoutPerformanceSchema,
  recoveryAnalysis: AiRecoveryAnalysisSchema,
  injuryRisk: AiInjuryRiskSchema,
  userVulnerabilities: z.array(z.string()).catch([]),
  improvementAnalysis: AiImprovementAnalysisSchema,
  goalProgress: AiGoalProgressSchema,
  personalizedRecommendations: z.array(AiRecommendationSchema).catch([
    {
      category: 'Recovery',
      priority: 'High',
      action: 'Drink at least 2.5 to 3.0 Liters of water daily.',
      rationale: 'Adequate hydration accelerates post-workout recovery and prevents cramping.'
    }
  ]),
  motivationMessage: z.string().catch('Great effort today! Keep pushing consistently towards your goals.')
});

/**
 * Multi-Gate Response Validation and Sanitization Service for AI Outputs.
 */
export class AiValidator {
  /**
   * Gate 1: Sanitizes markdown code fences, removes trailing commentary,
   * and extracts the root JSON string '{ ... }'.
   */
  static sanitizeJsonText(rawText: string): string {
    if (!rawText || typeof rawText !== 'string') return '{}';
    
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
  static validateAndClean(rawText: string): AiOutputPayload {
  // ---------------------------------------
  // Gate 1: Sanitize text
  // ---------------------------------------
  const cleanJson = this.sanitizeJsonText(rawText);

  // ---------------------------------------
  // Gate 2: Parse JSON
  // ---------------------------------------
  let parsed: any;

  try {
    parsed = JSON.parse(cleanJson);
  } catch (err: any) {
    throw new Error(
      `JSON_PARSE_ERROR: Failed to parse AI output. ${err.message}`
    );
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

      estimatedWeeksToGoal:
        parsed.goalPathing.estimatedWeeksToGoal ?? null,

      qualitativeAssessment:
        parsed.goalPathing.paceAssessment ??
        "Progressing towards goal."
    };
  }

  if (!parsed.workoutPerformance && parsed.performanceVariance) {
    parsed.workoutPerformance = {
      intensityLevel: "Moderate",

      caloriesBurnedVariance:
        parsed.performanceVariance.caloriesBurnedVariance ?? 0,

      durationVariance:
        parsed.performanceVariance.durationVariance ?? 0,

      feedback: "Workout analyzed successfully."
    };
  }

  // ---------------------------------------
  // Ensure required nested objects exist
  // ---------------------------------------

  parsed.consistencyAnalysis ??= {};
  parsed.workoutPerformance ??= {};
  parsed.recoveryAnalysis ??= {};
  parsed.injuryRisk ??= {};
  parsed.improvementAnalysis ??= {};
  parsed.goalProgress ??= {};
  parsed.personalizedRecommendations ??= [];
  parsed.userVulnerabilities ??= [];

  // ---------------------------------------
  // Normalize confidence score
  // Gemini sometimes returns 92 instead of 0.92
  // ---------------------------------------

  if (
    typeof parsed.confidenceScore === "number" &&
    parsed.confidenceScore > 1
  ) {
    parsed.confidenceScore = parsed.confidenceScore / 100;
  }

  // ---------------------------------------
  // Gate 3: Zod validation
  // ---------------------------------------

  const validated = AiOutputSchema.parse(parsed) as AiOutputPayload;

  // ---------------------------------------
  // Gate 4: Clamp numeric values
  // ---------------------------------------

  validated.progressScore = Math.max(
    0,
    Math.min(100, Math.round(validated.progressScore))
  );

  validated.confidenceScore = Math.max(
    0,
    Math.min(1, Number(validated.confidenceScore.toFixed(2)))
  );

  validated.consistencyAnalysis.completedWorkoutsCount = Math.max(
    0,
    Math.min(
      7,
      Math.round(validated.consistencyAnalysis.completedWorkoutsCount)
    )
  );

  validated.consistencyAnalysis.missedWorkoutsCount = Math.max(
    0,
    Math.min(
      7,
      Math.round(validated.consistencyAnalysis.missedWorkoutsCount)
    )
  );

  validated.consistencyAnalysis.weeklyAdherencePercentage = Math.max(
    0,
    Math.min(
      100,
      Number(
        validated.consistencyAnalysis.weeklyAdherencePercentage.toFixed(1)
      )
    )
  );

  validated.workoutPerformance.caloriesBurnedVariance = Math.max(
    -100,
    Math.min(
      500,
      Number(
        validated.workoutPerformance.caloriesBurnedVariance.toFixed(1)
      )
    )
  );

  validated.workoutPerformance.durationVariance = Math.max(
    -100,
    Math.min(
      500,
      Number(
        validated.workoutPerformance.durationVariance.toFixed(1)
      )
    )
  );

  if (validated.goalProgress.estimatedWeeksToGoal != null) {
    validated.goalProgress.estimatedWeeksToGoal = Math.max(
      1,
      Math.min(
        104,
        Math.round(validated.goalProgress.estimatedWeeksToGoal)
      )
    );
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
        rationale:
          "Proper sleep improves muscle recovery and overall performance."
      }
    ];
  }

  return validated;
}
}
