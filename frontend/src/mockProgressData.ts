import type { DashboardData } from './models';

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
    { exercise: 'Overhead', score: 75, fullMark: 100 },
    { exercise: 'Squat', score: 90, fullMark: 100 },
    { exercise: 'Deadlift', score: 85, fullMark: 100 },
    { exercise: 'Pull-up', score: 60, fullMark: 100 },
    { exercise: 'Bench', score: 80, fullMark: 100 },
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
  nutritionCompliance: {
    proteinPct: 92,
    proteinGoal: 120,
    caloriesPct: 87,
    caloriesGoal: 2200,
    waterPct: 95,
    waterGoal: 3,
  },
};
