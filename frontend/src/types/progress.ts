// =============================================================================
// FitAI-X Progress Tracker — TypeScript Interfaces
// Source of Truth: AI_INPUT.MD + AI_OUTPUT.MD
// =============================================================================

// ---------------------------------------------------------------------------
// INPUT TYPES (AI_INPUT.MD)
// ---------------------------------------------------------------------------

export interface WorkoutPlan {
  planId: string;
  planName: string;
  frequencyPerWeek: number; // 1–7
  targetCaloriesBurnPerSession: number; // 100–2000
  targetSleepPerNight: number; // 5.0–12.0 hours
  targetWaterPerDay: number; // 1.5–6.0 liters
  targetStepsPerDay: number; // 1000–50000
}

export type Gender = 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say';
export type FitnessLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type CurrentGoal = 'Muscle Gain' | 'Fat Loss' | 'Endurance' | 'Maintenance';

export interface UserProfile {
  userId: string;
  name: string;
  age: number; // 13–120
  gender: Gender;
  height: number; // cm, 100–250
  weight: number; // kg, 30.0–300.0
  fitnessLevel: FitnessLevel;
  currentGoal: CurrentGoal;
  workoutPlan: WorkoutPlan;
}

export type Mood = 'Energetic' | 'Good' | 'Tired' | 'Exhausted' | 'Stressed';

export interface InjuryRecord {
  hasInjury: boolean;
  painLevel: number; // 0–10; required if hasInjury
  details?: string; // max 250 chars
}

export interface DailyProgress {
  date: string; // YYYY-MM-DD
  workoutCompleted: boolean;
  workoutType: string | null; // required if workoutCompleted
  workoutDuration: number; // minutes, 5–360; required if workoutCompleted
  caloriesBurned: number; // 0–3000; required if workoutCompleted
  caloriesConsumed: number; // 0–10000
  steps: number; // 0–100000
  sleepHours: number; // 0.0–24.0
  waterIntake: number; // liters, 0.0–15.0
  mood: Mood;
  energyLevel: number; // 1–10
  injury: InjuryRecord;
  notes?: string; // max 500 chars
}

export interface AIInputPayload {
  userProfile: UserProfile;
  todayProgress: DailyProgress;
  previousHistory: Omit<DailyProgress, 'notes'>[]; // 0–7 items
}

// ---------------------------------------------------------------------------
// OUTPUT TYPES (AI_OUTPUT.MD)
// ---------------------------------------------------------------------------

export type ConsistencyStatus = 'Excellent' | 'On Track' | 'Needs Attention' | 'Unsatisfactory';
export type IntensityLevel = 'High' | 'Moderate' | 'Low';
export type RecoveryStatus = 'Optimal' | 'Adequate' | 'Impaired' | 'Critical';
export type SleepQuality = 'Good' | 'Fair' | 'Poor';
export type HydrationStatus = 'Optimal' | 'Sub-optimal' | 'Critical';
export type FatigueLevel = 'Low' | 'Medium' | 'High';
export type InjuryRiskLevel = 'Low' | 'Moderate' | 'High';
export type GoalProgressStatus = 'Ahead of Plan' | 'On Track' | 'Behind Plan' | 'Stagnant';
export type RecommendationCategory = 'Workout' | 'Diet' | 'Recovery' | 'Safety';
export type RecommendationPriority = 'High' | 'Medium' | 'Low';

export interface ConsistencyAnalysis {
  status: ConsistencyStatus;
  completedWorkoutsCount: number; // 0–7
  missedWorkoutsCount: number; // 0–7
  weeklyAdherencePercentage: number; // 0.0–100.0
}

export interface WorkoutPerformance {
  intensityLevel: IntensityLevel;
  caloriesBurnedVariance: number; // -100.0–500.0 %
  durationVariance: number; // -100.0–500.0 %
  feedback: string; // 10–150 chars
}

export interface RecoveryAnalysis {
  status: RecoveryStatus;
  sleepQuality: SleepQuality;
  hydrationStatus: HydrationStatus;
  fatigueLevel: FatigueLevel;
  insights: string[]; // min 1, max 120 chars each
}

export interface InjuryRisk {
  riskLevel: InjuryRiskLevel;
  criticalAreas: string[];
  preventativeAction: string; // 15–200 chars
}

export interface ImprovementAnalysis {
  isImproving: boolean;
  metricChanges: string[]; // min 1 item
  primaryBottleneck: string; // 10–150 chars
}

export interface GoalProgress {
  status: GoalProgressStatus;
  estimatedWeeksToGoal: number | null; // 1–104, nullable for maintenance
  qualitativeAssessment: string; // 10–200 chars
}

export interface PersonalizedRecommendation {
  category: RecommendationCategory;
  priority: RecommendationPriority;
  action: string; // 15–100 chars
  rationale: string; // 15–150 chars
}

export interface AIOutputPayload {
  progressScore: number; // 0–100
  confidenceScore: number; // 0.0–1.0
  consistencyAnalysis: ConsistencyAnalysis;
  workoutPerformance: WorkoutPerformance;
  recoveryAnalysis: RecoveryAnalysis;
  injuryRisk: InjuryRisk;
  userVulnerabilities: string[];
  improvementAnalysis: ImprovementAnalysis;
  goalProgress: GoalProgress;
  personalizedRecommendations: PersonalizedRecommendation[];
  motivationMessage: string; // 20–300 chars
}

// ---------------------------------------------------------------------------
// FRONTEND COMPOSITE MODELS (merged AI_INPUT + AI_OUTPUT for dashboard)
// ---------------------------------------------------------------------------

export type TimeRange = '7D' | '30D' | '90D' | '1Y';

export interface WeightDataPoint {
  date: string; // display label e.g. "Apr 22"
  weight: number; // kg
}

export interface CalorieDataPoint {
  day: string; // e.g. "M", "T", "W"
  calories: number;
  target: number;
}

export interface StrengthMetric {
  subject: string; // e.g. "Squat", "Bench"
  value: number; // 0–100 normalized score
  fullMark: number; // always 100
}

export interface CompletionDataPoint {
  name: string; // "Completed" | "Missed" | "Skipped"
  value: number;
  color: string;
}

export interface RecoveryTrendPoint {
  date: string;
  score: number; // 0–100
}

export interface NutritionCompliance {
  protein: number; // percentage 0–100
  calories: number; // percentage 0–100
  water: number; // percentage 0–100
  proteinGoal: string; // e.g. "120g"
  caloriesGoal: string; // e.g. "2200"
  waterGoal: string; // e.g. "3L"
}

export interface Achievement {
  id: string;
  icon: string; // emoji or icon identifier
  value: string; // e.g. "100", "5KG"
  label: string; // e.g. "Workouts", "Lost"
  color: string; // hex
}

export interface ProgressDashboardData {
  // From AI input
  userProfile: UserProfile;
  todayProgress: DailyProgress;
  historicalData: DailyProgress[];

  // From AI output
  progressScore: number;
  confidenceScore: number;
  consistencyAnalysis: ConsistencyAnalysis;
  workoutPerformance: WorkoutPerformance;
  recoveryAnalysis: RecoveryAnalysis;
  injuryRisk: InjuryRisk;
  userVulnerabilities: string[];
  improvementAnalysis: ImprovementAnalysis;
  goalProgress: GoalProgress;
  personalizedRecommendations: PersonalizedRecommendation[];
  motivationMessage: string;

  // Chart data (varies by time range)
  weightHistory: WeightDataPoint[];
  calorieHistory: CalorieDataPoint[];
  strengthMetrics: StrengthMetric[];
  completionData: CompletionDataPoint[];
  recoveryTrend: RecoveryTrendPoint[];
  nutritionCompliance: NutritionCompliance;
  achievements: Achievement[];

  // Summary stats
  streakDays: number;
  completedWorkouts: number;
  targetWorkouts: number;
  avgCaloriesBurned: number;
  weightChange: number; // negative = lost weight
  strengthChangePercent: number;
}
