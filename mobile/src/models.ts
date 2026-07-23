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
  completionRate: number;
}

export interface CalorieDataPoint {
  day: string;
  calories: number;
  goal: number;
}

export interface RecoveryDataPoint {
  date: string;
  score: number;
}

export interface NutritionMetric {
  name: string;
  score: number; // percentage 0-100
  goalText: string;
}

export interface Achievement {
  id: string;
  iconName: string;
  value: string;
  label: string;
  color: string;
}

export interface DashboardData {
  userProfile: UserProfile;
  progressScore: ProgressScore;
  weightProgress: WeightDataPoint[];
  strengthMetrics: StrengthMetric[];
  workoutCompletion: WorkoutCompletion;
  calorieHistory: CalorieDataPoint[];
  recoveryTrend: RecoveryDataPoint[];
  nutrition: NutritionMetric[];
  achievements: Achievement[];
  aiInsights: string;
}

export const mockProgressData: DashboardData = {
  userProfile: {
    id: 'user_01',
    name: 'Alex',
    currentGoal: 'Gain Muscle',
    streakDays: 24,
    workoutsCompleted: 100,
  },
  progressScore: {
    fitnessScore: 85,
    fitnessScoreMax: 100,
    message: 'Great Progress! 🔥',
    streakDays: 24,
    workoutsCompleted: 5,
    workoutsTotal: 6,
  },
  weightProgress: [
    { date: 'Apr 22', weight: 70.1 },
    { date: 'Apr 29', weight: 69.5 },
    { date: 'May 6', weight: 69.0 },
    { date: 'May 13', weight: 68.7 },
    { date: 'May 20', weight: 68.4 },
  ],
  strengthMetrics: [
    { exercise: 'OHP', score: 80, fullMark: 100 },
    { exercise: 'Squat', score: 90, fullMark: 100 },
    { exercise: 'Deadlift', score: 70, fullMark: 100 },
    { exercise: 'Pull-up', score: 85, fullMark: 100 },
    { exercise: 'Bench', score: 95, fullMark: 100 },
  ],
  workoutCompletion: {
    completed: 19,
    missed: 6,
    skipped: 3,
    total: 28,
    completionRate: 76,
  },
  calorieHistory: [
    { day: 'M', calories: 410, goal: 500 },
    { day: 'T', calories: 350, goal: 500 },
    { day: 'W', calories: 480, goal: 500 },
    { day: 'T', calories: 380, goal: 500 },
    { day: 'F', calories: 520, goal: 500 },
    { day: 'S', calories: 450, goal: 500 },
    { day: 'S', calories: 600, goal: 500 },
  ],
  recoveryTrend: [
    { date: 'Apr 22', score: 80 },
    { date: 'Apr 29', score: 75 },
    { date: 'May 6', score: 85 },
    { date: 'May 13', score: 70 },
    { date: 'May 20', score: 92 },
  ],
  nutrition: [
    { name: 'Protein', score: 92, goalText: 'Goal: 120g' },
    { name: 'Calories', score: 87, goalText: 'Goal: 2200' },
    { name: 'Water', score: 95, goalText: 'Goal: 3L' },
  ],
  achievements: [
    { id: '1', iconName: 'trophy-outline', value: '100', label: 'Workouts', color: '#EAB308' },
    { id: '2', iconName: 'water-outline', value: '5KG', label: 'Lost', color: '#F97316' },
    { id: '3', iconName: 'calendar-outline', value: '30', label: 'Day Streak', color: '#EF4444' },
  ],
  aiInsights: 'Consistency improved by 18%. Increase lower body intensity next week to keep strength gains balanced.',
};
