export type CoachPersona = 'Motivational' | 'Strict' | 'Analytical' | 'Enthusiastic';

export interface AiWorkoutPlan {
  planId?: string;
  planName?: string;
  frequencyPerWeek?: number;
  targetCaloriesBurnPerSession?: number;
  targetSleepPerNight?: number;
  targetWaterPerDay?: number;
  targetStepsPerDay?: number;
}

export interface AiUserProfile {
  userId?: string;
  name?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say' | string;
  height?: number;
  weight?: number;
  fitnessLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  currentGoal?: 'Muscle Gain' | 'Fat Loss' | 'Endurance' | 'Maintenance' | string;
  workoutPlan?: AiWorkoutPlan;
}

export interface AiInjury {
  hasInjury: boolean;
  painLevel?: number;
  details?: string;
}

export interface AiProgressLog {
  date: string;
  workoutCompleted: boolean;
  workoutType?: string | null;
  workoutDuration?: number | null;
  caloriesBurned?: number | null;
  caloriesConsumed?: number;
  steps?: number;
  sleepHours?: number;
  waterIntake?: number;
  mood?: 'Energetic' | 'Good' | 'Tired' | 'Exhausted' | 'Stressed' | string;
  energyLevel?: number;
  injury?: AiInjury;
  notes?: string | null;
}

export interface AiInputPayload {
  userProfile?: AiUserProfile;
  todayProgress?: AiProgressLog;
  previousHistory?: AiProgressLog[];
}

export interface AiConsistencyAnalysis {
  status: 'Excellent' | 'On Track' | 'Needs Attention' | 'Unsatisfactory';
  completedWorkoutsCount: number;
  missedWorkoutsCount: number;
  weeklyAdherencePercentage: number;
}

export interface AiWorkoutPerformance {
  intensityLevel: 'High' | 'Moderate' | 'Low';
  caloriesBurnedVariance: number;
  durationVariance: number;
  feedback: string;
}

export interface AiRecoveryAnalysis {
  status: 'Optimal' | 'Adequate' | 'Impaired' | 'Critical';
  sleepQuality: 'Good' | 'Fair' | 'Poor';
  hydrationStatus: 'Optimal' | 'Sub-optimal' | 'Critical';
  fatigueLevel: 'Low' | 'Medium' | 'High';
  insights: string[];
}

export interface AiInjuryRisk {
  riskLevel: 'Low' | 'Moderate' | 'High';
  criticalAreas: string[];
  preventativeAction: string;
}

export interface AiImprovementAnalysis {
  isImproving: boolean;
  metricChanges: string[];
  primaryBottleneck: string;
}

export interface AiGoalProgress {
  status: 'Ahead of Plan' | 'On Track' | 'Behind Plan' | 'Stagnant';
  estimatedWeeksToGoal: number | null;
  qualitativeAssessment: string;
}

export interface AiPersonalizedRecommendation {
  category: 'Workout' | 'Diet' | 'Recovery' | 'Safety';
  priority: 'High' | 'Medium' | 'Low';
  action: string;
  rationale: string;
}

export interface AiOutputPayload {
  progressScore: number;
  confidenceScore: number;
  consistencyAnalysis: AiConsistencyAnalysis;
  workoutPerformance: AiWorkoutPerformance;
  recoveryAnalysis: AiRecoveryAnalysis;
  injuryRisk: AiInjuryRisk;
  userVulnerabilities: string[];
  improvementAnalysis: AiImprovementAnalysis;
  goalProgress: AiGoalProgress;
  personalizedRecommendations: AiPersonalizedRecommendation[];
  motivationMessage: string;
}
