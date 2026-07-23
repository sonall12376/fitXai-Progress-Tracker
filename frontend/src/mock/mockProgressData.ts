// =============================================================================
// FitAI-X Progress Tracker — Mock Data
// Fully typed, realistic dataset dynamically changing per time range (7D / 30D / 90D / 1Y)
// =============================================================================

import type {
  ProgressDashboardData,
  UserProfile,
  DailyProgress,
  AIOutputPayload,
  WeightDataPoint,
  CalorieDataPoint,
  StrengthMetric,
  CompletionDataPoint,
  RecoveryTrendPoint,
  NutritionCompliance,
  Achievement,
  TimeRange,
} from '@/types/progress';

// ---------------------------------------------------------------------------
// User Profile (Static demographic baseline)
// ---------------------------------------------------------------------------
export const mockUserProfile: UserProfile = {
  userId: 'USR001',
  name: 'Rahul',
  age: 22,
  gender: 'Male',
  height: 175,
  weight: 72.5,
  fitnessLevel: 'Beginner',
  currentGoal: 'Muscle Gain',
  workoutPlan: {
    planId: 'PLAN-HYP-01',
    planName: 'Push-Pull-Legs Routine',
    frequencyPerWeek: 4,
    targetCaloriesBurnPerSession: 400,
    targetSleepPerNight: 8.0,
    targetWaterPerDay: 3.0,
    targetStepsPerDay: 8000,
  },
};

// ---------------------------------------------------------------------------
// Today's Progress
// ---------------------------------------------------------------------------
export const mockTodayProgress: DailyProgress = {
  date: '2026-07-22',
  workoutCompleted: true,
  workoutType: 'Chest & Triceps',
  workoutDuration: 65,
  caloriesBurned: 450,
  caloriesConsumed: 2800,
  steps: 9200,
  sleepHours: 6.5,
  waterIntake: 2.2,
  mood: 'Tired',
  energyLevel: 5,
  injury: {
    hasInjury: true,
    painLevel: 3,
    details: 'Slight pinch in the front of left shoulder during bench press.',
  },
  notes: 'Muscle strength was solid, but felt fatigued in the final sets.',
};

// ---------------------------------------------------------------------------
// Historical Daily Progress (7 days prior)
// ---------------------------------------------------------------------------
export const mockHistoricalData: DailyProgress[] = [
  {
    date: '2026-07-21',
    workoutCompleted: true,
    workoutType: 'Back & Biceps',
    workoutDuration: 60,
    caloriesBurned: 420,
    caloriesConsumed: 2950,
    steps: 8500,
    sleepHours: 7.5,
    waterIntake: 3.1,
    mood: 'Energetic',
    energyLevel: 8,
    injury: { hasInjury: false, painLevel: 0 },
  },
  {
    date: '2026-07-20',
    workoutCompleted: false,
    workoutType: null,
    workoutDuration: 0,
    caloriesBurned: 0,
    caloriesConsumed: 2400,
    steps: 4500,
    sleepHours: 8.0,
    waterIntake: 2.8,
    mood: 'Good',
    energyLevel: 7,
    injury: { hasInjury: false, painLevel: 0 },
  },
  {
    date: '2026-07-19',
    workoutCompleted: true,
    workoutType: 'Legs',
    workoutDuration: 55,
    caloriesBurned: 500,
    caloriesConsumed: 3100,
    steps: 10500,
    sleepHours: 8.5,
    waterIntake: 3.5,
    mood: 'Energetic',
    energyLevel: 9,
    injury: { hasInjury: false, painLevel: 0 },
  },
];

// ---------------------------------------------------------------------------
// Dynamic Time-Range Data Structures
// ---------------------------------------------------------------------------

// 1. Weight History
const weightHistoryMap: Record<TimeRange, WeightDataPoint[]> = {
  '7D': [
    { date: 'Jul 15', weight: 73.2 },
    { date: 'Jul 16', weight: 73.0 },
    { date: 'Jul 17', weight: 72.9 },
    { date: 'Jul 18', weight: 73.1 },
    { date: 'Jul 19', weight: 72.7 },
    { date: 'Jul 20', weight: 72.6 },
    { date: 'Jul 21', weight: 72.5 },
  ],
  '30D': [
    { date: 'Jun 22', weight: 75.0 },
    { date: 'Jun 26', weight: 74.6 },
    { date: 'Jun 30', weight: 74.2 },
    { date: 'Jul 4',  weight: 73.9 },
    { date: 'Jul 8',  weight: 73.5 },
    { date: 'Jul 12', weight: 73.2 },
    { date: 'Jul 16', weight: 73.0 },
    { date: 'Jul 20', weight: 72.6 },
    { date: 'Jul 22', weight: 72.5 },
  ],
  '90D': [
    { date: 'Apr 22', weight: 77.4 },
    { date: 'May 6',  weight: 76.5 },
    { date: 'May 20', weight: 75.8 },
    { date: 'Jun 3',  weight: 75.1 },
    { date: 'Jun 17', weight: 74.4 },
    { date: 'Jul 1',  weight: 73.6 },
    { date: 'Jul 15', weight: 73.0 },
    { date: 'Jul 22', weight: 72.5 },
  ],
  '1Y': [
    { date: 'Jul \'25', weight: 82.0 },
    { date: 'Sep \'25', weight: 80.5 },
    { date: 'Nov \'25', weight: 78.8 },
    { date: 'Jan \'26', weight: 77.2 },
    { date: 'Mar \'26', weight: 75.6 },
    { date: 'May \'26', weight: 74.0 },
    { date: 'Jul \'26', weight: 72.5 },
  ],
};

// 2. Calorie History
const calorieHistoryMap: Record<TimeRange, CalorieDataPoint[]> = {
  '7D': [
    { day: 'M', calories: 410, target: 400 },
    { day: 'T', calories: 460, target: 400 },
    { day: 'W', calories: 0,   target: 400 },
    { day: 'T', calories: 380, target: 400 },
    { day: 'F', calories: 500, target: 400 },
    { day: 'S', calories: 420, target: 400 },
    { day: 'S', calories: 450, target: 400 },
  ],
  '30D': [
    { day: 'W1', calories: 398, target: 400 },
    { day: 'W2', calories: 415, target: 400 },
    { day: 'W3', calories: 440, target: 400 },
    { day: 'W4', calories: 430, target: 400 },
  ],
  '90D': [
    { day: 'Apr', calories: 380, target: 400 },
    { day: 'May', calories: 405, target: 400 },
    { day: 'Jun', calories: 425, target: 400 },
    { day: 'Jul', calories: 440, target: 400 },
  ],
  '1Y': [
    { day: 'Sep', calories: 360, target: 400 },
    { day: 'Oct', calories: 375, target: 400 },
    { day: 'Nov', calories: 390, target: 400 },
    { day: 'Dec', calories: 410, target: 400 },
    { day: 'Jan', calories: 400, target: 400 },
    { day: 'Feb', calories: 415, target: 400 },
    { day: 'Mar', calories: 420, target: 400 },
    { day: 'Apr', calories: 430, target: 400 },
    { day: 'May', calories: 435, target: 400 },
    { day: 'Jun', calories: 440, target: 400 },
  ],
};

// 3. Recovery Trend
const recoveryTrendMap: Record<TimeRange, RecoveryTrendPoint[]> = {
  '7D': [
    { date: 'Jul 15', score: 78 },
    { date: 'Jul 17', score: 81 },
    { date: 'Jul 19', score: 85 },
    { date: 'Jul 21', score: 88 },
  ],
  '30D': [
    { date: 'Jun 22', score: 65 },
    { date: 'Jul 6',  score: 75 },
    { date: 'Jul 20', score: 83 },
  ],
  '90D': [
    { date: 'Apr 22', score: 55 },
    { date: 'May 20', score: 68 },
    { date: 'Jun 17', score: 78 },
    { date: 'Jul 22', score: 85 },
  ],
  '1Y': [
    { date: 'Jul \'25', score: 45 },
    { date: 'Nov \'25', score: 62 },
    { date: 'Mar \'26', score: 76 },
    { date: 'Jul \'26', score: 88 },
  ],
};

// 4. Strength Metrics per Time Range
const strengthMetricsMap: Record<TimeRange, { metrics: StrengthMetric[]; changePercent: number }> = {
  '7D': {
    metrics: [
      { subject: 'Squat',     value: 70, fullMark: 100 },
      { subject: 'Deadlift',  value: 65, fullMark: 100 },
      { subject: 'Bench',     value: 58, fullMark: 100 },
      { subject: 'Pull-up',   value: 52, fullMark: 100 },
      { subject: 'Overhead',  value: 50, fullMark: 100 },
    ],
    changePercent: 5,
  },
  '30D': {
    metrics: [
      { subject: 'Squat',     value: 75, fullMark: 100 },
      { subject: 'Deadlift',  value: 68, fullMark: 100 },
      { subject: 'Bench',     value: 62, fullMark: 100 },
      { subject: 'Pull-up',   value: 58, fullMark: 100 },
      { subject: 'Overhead',  value: 55, fullMark: 100 },
    ],
    changePercent: 12,
  },
  '90D': {
    metrics: [
      { subject: 'Squat',     value: 78, fullMark: 100 },
      { subject: 'Deadlift',  value: 72, fullMark: 100 },
      { subject: 'Bench',     value: 65, fullMark: 100 },
      { subject: 'Pull-up',   value: 60, fullMark: 100 },
      { subject: 'Overhead',  value: 58, fullMark: 100 },
    ],
    changePercent: 18,
  },
  '1Y': {
    metrics: [
      { subject: 'Squat',     value: 85, fullMark: 100 },
      { subject: 'Deadlift',  value: 80, fullMark: 100 },
      { subject: 'Bench',     value: 75, fullMark: 100 },
      { subject: 'Pull-up',   value: 70, fullMark: 100 },
      { subject: 'Overhead',  value: 68, fullMark: 100 },
    ],
    changePercent: 28,
  },
};

// 5. Workout Completion Donut per Time Range
const completionDataMap: Record<TimeRange, { data: CompletionDataPoint[]; streak: number; completed: number; target: number }> = {
  '7D': {
    data: [
      { name: 'Completed', value: 5, color: '#F5C400' },
      { name: 'Missed',    value: 1, color: '#EF4444' },
      { name: 'Skipped',   value: 0, color: '#B0AA9A' },
    ],
    streak: 7,
    completed: 5,
    target: 6,
  },
  '30D': {
    data: [
      { name: 'Completed', value: 19, color: '#F5C400' },
      { name: 'Missed',    value: 6,  color: '#EF4444' },
      { name: 'Skipped',   value: 3,  color: '#B0AA9A' },
    ],
    streak: 24,
    completed: 19,
    target: 28,
  },
  '90D': {
    data: [
      { name: 'Completed', value: 54, color: '#F5C400' },
      { name: 'Missed',    value: 12, color: '#EF4444' },
      { name: 'Skipped',   value: 6,  color: '#B0AA9A' },
    ],
    streak: 68,
    completed: 54,
    target: 72,
  },
  '1Y': {
    data: [
      { name: 'Completed', value: 210, color: '#F5C400' },
      { name: 'Missed',    value: 35,  color: '#EF4444' },
      { name: 'Skipped',   value: 15,  color: '#B0AA9A' },
    ],
    streak: 180,
    completed: 210,
    target: 260,
  },
};

// 6. Nutrition Compliance per Time Range
const nutritionComplianceMap: Record<TimeRange, NutritionCompliance> = {
  '7D':  { protein: 95, calories: 90, water: 88, proteinGoal: '120g', caloriesGoal: '2200', waterGoal: '3L' },
  '30D': { protein: 92, calories: 87, water: 95, proteinGoal: '120g', caloriesGoal: '2200', waterGoal: '3L' },
  '90D': { protein: 88, calories: 84, water: 92, proteinGoal: '120g', caloriesGoal: '2200', waterGoal: '3L' },
  '1Y':  { protein: 90, calories: 86, water: 94, proteinGoal: '120g', caloriesGoal: '2200', waterGoal: '3L' },
};

// 7. Dynamic AI Output per Time Range
const aiOutputMap: Record<TimeRange, AIOutputPayload> = {
  '7D': {
    progressScore: 88,
    confidenceScore: 0.98,
    consistencyAnalysis: { status: 'Excellent', completedWorkoutsCount: 5, missedWorkoutsCount: 1, weeklyAdherencePercentage: 83.3 },
    workoutPerformance: { intensityLevel: 'High', caloriesBurnedVariance: 15.0, durationVariance: 8.0, feedback: 'Strong weekly effort with peak volume on Leg day.' },
    recoveryAnalysis: { status: 'Optimal', sleepQuality: 'Good', hydrationStatus: 'Optimal', fatigueLevel: 'Low', insights: ['Hydration met target 5/7 days.'] },
    injuryRisk: { riskLevel: 'Low', criticalAreas: [], preventativeAction: 'Maintain current mobility routine.' },
    userVulnerabilities: ['Late-night screen time on rest days'],
    improvementAnalysis: { isImproving: true, metricChanges: ['7-day calorie burn target exceeded by 5%'], primaryBottleneck: 'Minor sleep variance on weekends.' },
    goalProgress: { status: 'Ahead of Plan', estimatedWeeksToGoal: 10, qualitativeAssessment: 'Pace is excellent for weekly muscle gain targets.' },
    personalizedRecommendations: [
      { category: 'Recovery', priority: 'Medium', action: 'Maintain 8h sleep schedule on rest days.', rationale: 'Consolidates weekly hypertrophy adaptations.' }
    ],
    motivationMessage: "Outstanding past 7 days, Rahul! You completed 5 workouts out of 6 planned. Keep this momentum rolling into next week!",
  },
  '30D': {
    progressScore: 85,
    confidenceScore: 0.95,
    consistencyAnalysis: { status: 'On Track', completedWorkoutsCount: 19, missedWorkoutsCount: 6, weeklyAdherencePercentage: 68.0 },
    workoutPerformance: { intensityLevel: 'Moderate', caloriesBurnedVariance: 12.5, durationVariance: 7.6, feedback: 'Pushed through today\'s Chest routine with solid duration.' },
    recoveryAnalysis: { status: 'Adequate', sleepQuality: 'Fair', hydrationStatus: 'Sub-optimal', fatigueLevel: 'Medium', insights: ['Sleep duration (6.5h) was 18.7% below target (8h).'] },
    injuryRisk: { riskLevel: 'Moderate', criticalAreas: ['Left Shoulder'], preventativeAction: 'Avoid bench presses with flat barbells; swap with neutral-grip dumbbells.' },
    userVulnerabilities: ['Dehydration on workout days', 'Correlated sleep deficits reducing late-workout energy levels'],
    improvementAnalysis: { isImproving: true, metricChanges: ['Workout duration increased from 58 to 65 minutes.'], primaryBottleneck: 'Dehydration is slowing metabolic recovery rates.' },
    goalProgress: { status: 'On Track', estimatedWeeksToGoal: 12, qualitativeAssessment: 'Calories consumed support your muscle-building objective.' },
    personalizedRecommendations: [
      { category: 'Recovery', priority: 'High', action: 'Consume 3.0 Liters of water daily.', rationale: 'Compensates for fluids lost in workouts.' }
    ],
    motivationMessage: "Solid work this month, Rahul! Your consistency is outstanding. Take care of that shoulder, drink some water, and get to bed early tonight.",
  },
  '90D': {
    progressScore: 90,
    confidenceScore: 0.96,
    consistencyAnalysis: { status: 'Excellent', completedWorkoutsCount: 54, missedWorkoutsCount: 12, weeklyAdherencePercentage: 75.0 },
    workoutPerformance: { intensityLevel: 'High', caloriesBurnedVariance: 18.2, durationVariance: 12.0, feedback: '90-day muscle volume increased by 18% across compound lifts.' },
    recoveryAnalysis: { status: 'Optimal', sleepQuality: 'Good', hydrationStatus: 'Optimal', fatigueLevel: 'Low', insights: ['Average sleep stabilized at 7.8 hours across 90 days.'] },
    injuryRisk: { riskLevel: 'Low', criticalAreas: [], preventativeAction: 'Continue pre-workout shoulder warmup.' },
    userVulnerabilities: ['Occasional skipped hydration on travel days'],
    improvementAnalysis: { isImproving: true, metricChanges: ['Overall strength index up +18%', 'Lost 4.9 kg of body fat'], primaryBottleneck: 'Nutrition compliance drops slightly on weekends.' },
    goalProgress: { status: 'Ahead of Plan', estimatedWeeksToGoal: 6, qualitativeAssessment: 'You are on track to achieve your body re-composition goal early.' },
    personalizedRecommendations: [
      { category: 'Diet', priority: 'Medium', action: 'Increase daily protein intake to 130g.', rationale: 'Supports advanced hypertrophy demands.' }
    ],
    motivationMessage: "Phenomenal 90-day transformation, Rahul! You've built significant strength while dropping 4.9 kg. You are close to your target goal!",
  },
  '1Y': {
    progressScore: 94,
    confidenceScore: 0.99,
    consistencyAnalysis: { status: 'Excellent', completedWorkoutsCount: 210, missedWorkoutsCount: 35, weeklyAdherencePercentage: 81.0 },
    workoutPerformance: { intensityLevel: 'High', caloriesBurnedVariance: 22.0, durationVariance: 15.0, feedback: 'Completed 210 full sessions over the year with zero major injuries.' },
    recoveryAnalysis: { status: 'Optimal', sleepQuality: 'Good', hydrationStatus: 'Optimal', fatigueLevel: 'Low', insights: ['Consistent year-long circadian rhythm discipline.'] },
    injuryRisk: { riskLevel: 'Low', criticalAreas: [], preventativeAction: 'Maintain current periodization schedule.' },
    userVulnerabilities: [],
    improvementAnalysis: { isImproving: true, metricChanges: ['Total weight reduced by 9.5 kg', 'Strength increased by 28% overall'], primaryBottleneck: 'Plateauing on overhead press weight limits.' },
    goalProgress: { status: 'Ahead of Plan', estimatedWeeksToGoal: 2, qualitativeAssessment: 'Primary fitness & strength transformation goals successfully achieved.' },
    personalizedRecommendations: [
      { category: 'Workout', priority: 'Low', action: 'Introduce a 1-week deload period.', rationale: 'Prevents central nervous system fatigue after a full year of training.' }
    ],
    motivationMessage: "Masterclass year of dedication, Rahul! 210 workouts completed, 9.5 kg lost, and +28% strength gain. You have transformed your baseline fitness level!",
  },
};

const weightChangeMap: Record<TimeRange, number> = {
  '7D':  -0.7,
  '30D': -2.5,
  '90D': -4.9,
  '1Y':  -9.5,
};

const avgCaloriesMap: Record<TimeRange, number> = {
  '7D':  420,
  '30D': 421,
  '90D': 413,
  '1Y':  395,
};

export const mockAchievements: Achievement[] = [
  { id: 'workouts-100', icon: '🏋️', value: '100',  label: 'Workouts',  color: '#F5C400' },
  { id: 'weight-lost',  icon: '💧', value: '5KG',   label: 'Lost',      color: '#FFB300' },
  { id: 'day-streak',   icon: '📅', value: '30',    label: 'Day Streak', color: '#EF4444' },
  { id: 'new-pr',       icon: '⚡', value: 'NEW',   label: 'PR Set',    color: '#A3E635' },
];

// ---------------------------------------------------------------------------
// Main factory — returns full ProgressDashboardData dynamically for selected time range
// ---------------------------------------------------------------------------
export function getMockProgressData(timeRange: TimeRange): ProgressDashboardData {
  const aiOutput      = aiOutputMap[timeRange];
  const strength      = strengthMetricsMap[timeRange];
  const completion    = completionDataMap[timeRange];
  const nutrition     = nutritionComplianceMap[timeRange];

  return {
    // Input
    userProfile: mockUserProfile,
    todayProgress: mockTodayProgress,
    historicalData: mockHistoricalData,

    // Dynamic AI Output per time range
    progressScore: aiOutput.progressScore,
    confidenceScore: aiOutput.confidenceScore,
    consistencyAnalysis: aiOutput.consistencyAnalysis,
    workoutPerformance: aiOutput.workoutPerformance,
    recoveryAnalysis: aiOutput.recoveryAnalysis,
    injuryRisk: aiOutput.injuryRisk,
    userVulnerabilities: aiOutput.userVulnerabilities,
    improvementAnalysis: aiOutput.improvementAnalysis,
    goalProgress: aiOutput.goalProgress,
    personalizedRecommendations: aiOutput.personalizedRecommendations,
    motivationMessage: aiOutput.motivationMessage,

    // Dynamic Charts per time range
    weightHistory: weightHistoryMap[timeRange],
    calorieHistory: calorieHistoryMap[timeRange],
    strengthMetrics: strength.metrics,
    completionData: completion.data,
    recoveryTrend: recoveryTrendMap[timeRange],
    nutritionCompliance: nutrition,
    achievements: mockAchievements,

    // Dynamic derived stats per time range
    streakDays: completion.streak,
    completedWorkouts: completion.completed,
    targetWorkouts: completion.target,
    avgCaloriesBurned: avgCaloriesMap[timeRange],
    weightChange: weightChangeMap[timeRange],
    strengthChangePercent: strength.changePercent,
  };
}
