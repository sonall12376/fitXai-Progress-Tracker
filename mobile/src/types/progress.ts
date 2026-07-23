// STEP 1 — TypeScript Interfaces
// Single source of truth for all data models

// ── Form ──────────────────────────────────────────────────────
export interface ProgressFormState {
  workoutCompleted: boolean;
  workoutType: string;
  workoutDuration: string;
  caloriesBurned: string;
  caloriesConsumed: string;
  steps: string;
  sleepHours: string;
  waterIntake: string;
  mood: string;
  energyLevel: number;
  hasInjury: boolean;
  painLevel: number;
  injuryDetails: string;
  notes: string;
}

// ── AI Input ──────────────────────────────────────────────────
export interface WorkoutPlan {
  planId: string;
  planName: string;
  frequencyPerWeek: number;
  targetCaloriesBurnPerSession: number;
  targetSleepPerNight: number;
  targetWaterPerDay: number;
  targetStepsPerDay: number;
}

export interface UserProfile {
  userId: string;
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  fitnessLevel: string;
  currentGoal: string;
  workoutPlan: WorkoutPlan;
}

export interface InjuryLog {
  hasInjury: boolean;
  painLevel: number;
  details?: string;
}

export interface DailyProgress {
  date: string;
  workoutCompleted: boolean;
  workoutType: string | null;
  workoutDuration: number;
  caloriesBurned: number;
  caloriesConsumed: number;
  steps: number;
  sleepHours: number;
  waterIntake: number;
  mood: string;
  energyLevel: number;
  injury: InjuryLog;
  notes?: string;
}

export interface AIInputPayload {
  userProfile: UserProfile;
  todayProgress: DailyProgress;
  previousHistory: DailyProgress[];
}

// ── AI Output ─────────────────────────────────────────────────
export interface ConsistencyAnalysis {
  status: 'Excellent' | 'On Track' | 'Needs Attention' | 'Unsatisfactory';
  completedWorkoutsCount: number;
  missedWorkoutsCount: number;
  weeklyAdherencePercentage: number;
}

export interface WorkoutPerformance {
  intensityLevel: 'High' | 'Moderate' | 'Low';
  caloriesBurnedVariance: number;
  durationVariance: number;
  feedback: string;
}

export interface RecoveryAnalysis {
  status: 'Optimal' | 'Adequate' | 'Impaired' | 'Critical';
  sleepQuality: 'Good' | 'Fair' | 'Poor';
  hydrationStatus: 'Optimal' | 'Sub-optimal' | 'Critical';
  fatigueLevel: 'Low' | 'Medium' | 'High';
  insights: string[];
}

export interface InjuryRisk {
  riskLevel: 'Low' | 'Moderate' | 'High';
  criticalAreas: string[];
  preventativeAction: string;
}

export interface ImprovementAnalysis {
  isImproving: boolean;
  metricChanges: string[];
  primaryBottleneck: string;
}

export interface GoalProgress {
  status: 'Ahead of Plan' | 'On Track' | 'Behind Plan' | 'Stagnant';
  estimatedWeeksToGoal: number;
  qualitativeAssessment: string;
}

export interface Recommendation {
  category: 'Workout' | 'Diet' | 'Recovery' | 'Safety';
  priority: 'High' | 'Medium' | 'Low';
  action: string;
  rationale: string;
}

export interface AIReport {
  progressScore: number;
  confidenceScore: number;
  consistencyAnalysis: ConsistencyAnalysis;
  workoutPerformance: WorkoutPerformance;
  recoveryAnalysis: RecoveryAnalysis;
  injuryRisk: InjuryRisk;
  userVulnerabilities: string[];
  improvementAnalysis: ImprovementAnalysis;
  goalProgress: GoalProgress;
  personalizedRecommendations: Recommendation[];
  motivationMessage: string;
}

// ── App State ─────────────────────────────────────────────────
export type DataSource = 'api' | 'asyncstorage' | 'mock';

export interface AppState {
  data: AIInputPayload | null;
  aiReport: AIReport | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  submitError: string | null;
  source: DataSource;
  isOnline: boolean;
}
