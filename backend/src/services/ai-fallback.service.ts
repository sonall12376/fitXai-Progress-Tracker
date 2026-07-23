import { AiInputPayload, AiOutputPayload } from '../types/ai.types';

export class AiFallbackService {
  /**
   * Generates a deterministic, rule-based fallback report when Gemini API is unreachable or times out.
   */
  static generateFallbackReport(inputPayload: AiInputPayload): AiOutputPayload {
    const today = inputPayload.todayProgress || ({} as any);
    const history = inputPayload.previousHistory || [];
    const profile = inputPayload.userProfile || {};
    const targetPlan = profile.workoutPlan || {};

    const workoutDone = today.workoutCompleted ?? false;
    const duration = today.workoutDuration || 0;
    const calories = today.caloriesBurned || 0;
    const sleep = today.sleepHours || 7.0;
    const water = today.waterIntake || 2.0;
    const pain = today.injury?.painLevel || 0;
    const hasInjury = today.injury?.hasInjury || false;

    // Consistency calculations
    const completedHistory = history.filter(h => h.workoutCompleted).length;
    const totalCompleted = completedHistory + (workoutDone ? 1 : 0);
    const totalDays = history.length + 1;
    const adherence = parseFloat(((totalCompleted / Math.max(1, totalDays)) * 100).toFixed(1));

    // Recovery heuristics
    const targetSleep = targetPlan.targetSleepPerNight || 8.0;
    const targetWater = targetPlan.targetWaterPerDay || 3.0;

    const sleepQuality = sleep >= targetSleep ? 'Good' : sleep >= targetSleep - 1.5 ? 'Fair' : 'Poor';
    const hydrationStatus = water >= targetWater ? 'Optimal' : water >= targetWater - 1.0 ? 'Sub-optimal' : 'Critical';

    let recoveryStatus: 'Optimal' | 'Adequate' | 'Impaired' | 'Critical' = 'Adequate';
    if (sleepQuality === 'Good' && hydrationStatus === 'Optimal') recoveryStatus = 'Optimal';
    else if (sleepQuality === 'Poor' || hydrationStatus === 'Critical') recoveryStatus = 'Impaired';

    // Injury Risk heuristics
    let riskLevel: 'Low' | 'Moderate' | 'High' = 'Low';
    let preventativeAction = '';
    const criticalAreas: string[] = [];

    if (hasInjury || pain >= 4) {
      riskLevel = pain >= 6 ? 'High' : 'Moderate';
      if (today.injury?.details) criticalAreas.push(today.injury.details);
      preventativeAction = 'Reduce training intensity, avoid heavy compound lifts, and consult a physical therapist if pain persists.';
    }

    // Score calculation
    let baseScore = 70;
    if (workoutDone) baseScore += 15;
    if (sleepQuality === 'Good') baseScore += 5;
    if (hydrationStatus === 'Optimal') baseScore += 5;
    if (hasInjury || pain >= 4) baseScore -= 15;
    const progressScore = Math.max(0, Math.min(100, baseScore));

    return {
      progressScore,
      confidenceScore: 0.50, // Offline fallback marker
      consistencyAnalysis: {
        status: adherence >= 80 ? 'Excellent' : adherence >= 60 ? 'On Track' : 'Needs Attention',
        completedWorkoutsCount: totalCompleted,
        missedWorkoutsCount: Math.max(0, totalDays - totalCompleted),
        weeklyAdherencePercentage: adherence
      },
      workoutPerformance: {
        intensityLevel: duration > 50 ? 'High' : duration > 20 ? 'Moderate' : 'Low',
        caloriesBurnedVariance: 0.0,
        durationVariance: 0.0,
        feedback: workoutDone 
          ? `Logged ${duration} min workout burning approximately ${calories} kcal.`
          : 'Rest day logged.'
      },
      recoveryAnalysis: {
        status: recoveryStatus,
        sleepQuality,
        hydrationStatus,
        fatigueLevel: sleep < 6 ? 'High' : sleep < 7 ? 'Medium' : 'Low',
        insights: [
          `Sleep logged: ${sleep} hrs (Target: ${targetSleep} hrs).`,
          `Water intake logged: ${water} L (Target: ${targetWater} L).`
        ]
      },
      injuryRisk: {
        riskLevel,
        criticalAreas,
        preventativeAction
      },
      userVulnerabilities: water < targetWater ? ['Hydration is below optimal target.'] : [],
      improvementAnalysis: {
        isImproving: true,
        metricChanges: ['Daily metrics successfully recorded.'],
        primaryBottleneck: water < targetWater ? 'Inadequate hydration.' : 'None.'
      },
      goalProgress: {
        status: 'On Track',
        estimatedWeeksToGoal: null,
        qualitativeAssessment: 'Maintaining progress logging cadence.'
      },
      personalizedRecommendations: [
        {
          category: 'Recovery',
          priority: 'High',
          action: `Target ${targetWater} Liters of water intake daily.`,
          rationale: 'Supports cellular recovery and prevents premature exercise fatigue.'
        },
        {
          category: 'Recovery',
          priority: 'Medium',
          action: `Aim for ${targetSleep} hours of restful sleep tonight.`,
          rationale: 'Crucial for muscle tissue repair and cognitive energy recovery.'
        }
      ],
      motivationMessage: `Solid effort tracking your progress today${profile.name ? ', ' + profile.name : ''}! Keep up the consistent logging.`
    };
  }
}
