// STEP 1 — TypeScript Interfaces (Aligned with AI_API_CONTRACT.md)

// ── Form State (UI layer) ─────────────────────────────────────
export interface ProgressFormState {
  workoutCompleted: boolean;
  workoutType: string;
  workoutDuration: string;   // string in form, converted to int on submit
  caloriesBurned: string;
  caloriesConsumed: string;
  steps: string;
  sleepHours: string;
  waterIntake: string;
  mood: string;
  energyLevel: number;       // 1–10
  hasInjury: boolean;
  painLevel: number;         // 0–10
  injuryDetails: string;
  notes: string;
}

// ── API Request Payload (POST /api/progress/log) ──────────────
export interface InjuryPayload {
  hasInjury: boolean;
  painLevel: number;         // int 0–10
}

export interface ProgressLogRequest {
  workoutCompleted: boolean;
  workoutType: string;
  workoutDuration: number;   // int (minutes)
  caloriesBurned: number;    // int
  caloriesConsumed: number;  // int
  steps: number;             // int
  sleepHours: number;        // float
  waterIntake: number;       // float
  mood: string;
  energyLevel: number;       // int 1–10
  injury: InjuryPayload;
  notes: string;
}

// ── Legacy / Internal model (AI Input layer) ──────────────────
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

// ── API Response — Analytics (GET /api/progress/analytics) ────
export interface AnalyticsResponse {
  averageProgressScore: number;
  workoutsCompleted: number;
  averageSleepHours: number;
  // Additional fields the backend may return
  [key: string]: unknown;
}

// ── AI Output (AI Report) ─────────────────────────────────────
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

// ── API response wrapper for POST /api/progress/log ──────────
export interface ProgressLogResponse {
  data: {
    report: AIReport;
  };
}

// ── Offline queue entry ───────────────────────────────────────
export interface OfflineQueueEntry {
  payload: ProgressLogRequest;
  queuedAt: string; // ISO timestamp
}

// ── App State ─────────────────────────────────────────────────
export type DataSource = 'api' | 'asyncstorage' | 'mock';

export interface AppState {
  data: AIInputPayload | null;
  aiReport: AIReport | null;
  analytics: AnalyticsResponse | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  submitError: string | null;
  submitSuccess: boolean;
  source: DataSource;
  isOnline: boolean;
}
