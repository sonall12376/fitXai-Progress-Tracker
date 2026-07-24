export interface UserProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  currentGoal: string;
  streakDays: number;
  workoutsCompleted: number;
}

export interface ProgressScore {
  fitnessScore: number;
  fitnessScoreMax: number;
  message: string;
  streakDays: number;
  workoutsCompleted: number;
  workoutsTotal: number;
}

export interface WeightDataPoint {
  date: string;
  weight: number;
}

export interface StrengthMetric {
  exercise: string;
  score: number;
  fullMark: number;
}

export interface WorkoutCompletion {
  completed: number;
  missed: number;
  skipped: number;
  total: number;
  completionRate: number; // percentage
}

export interface CalorieDataPoint {
  day: string;
  calories: number;
  goal: number;
}

export interface RecoveryDataPoint {
  date: string;
  score: number; // percentage
}

export interface NutritionCompliance {
  proteinPct: number;
  proteinGoal: number;
  caloriesPct: number;
  caloriesGoal: number;
  waterPct: number;
  waterGoal: number;
}

export interface DashboardData {
  userProfile: UserProfile;
  progressScore: ProgressScore;
  weightProgress: WeightDataPoint[];
  strengthMetrics: StrengthMetric[];
  workoutCompletion: WorkoutCompletion;
  calorieHistory: CalorieDataPoint[];
  recoveryTrend: RecoveryDataPoint[];
  nutritionCompliance: NutritionCompliance;
}
