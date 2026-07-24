import { AIInputPayload, AIReport } from './types/progress';

export interface ChartData {
  fitnessScore: number;
  weightLoss: string;
  weightCurrent: string;
  weightTrend: string;
  strengthGain: string;
  strengthRadar: string;
  workoutCompletion: number;
  caloriesAvg: number;
  caloriesData: number[];
  recoveryTrend: string;
  proteinPct: number;
  caloriesPct: number;
  waterPct: number;
  achievements: { num: string; label: string }[];
}

export const MOCK_CHARTS: Record<string, ChartData> = {
  '7D': {
    fitnessScore: 78, weightLoss: '↓ 0.5 kg', weightCurrent: '71.2', weightTrend: '0,20 20,22 40,18 60,15 80,10 100,12 120,8 150,5',
    strengthGain: '+3%', strengthRadar: '50,30 70,40 60,70 40,70 30,40', workoutCompletion: 85, caloriesAvg: 410, caloriesData: [45, 60, 50, 40, 75, 55, 90],
    recoveryTrend: '0,10 20,15 40,12 60,8 80,20 100,15 120,10 150,5', proteinPct: 0.85, caloriesPct: 0.90, waterPct: 0.80,
    achievements: [{ num: '5', label: 'Workouts' }, { num: '1', label: 'New PR' }, { num: '7', label: 'Day Streak' }]
  },
  '30D': {
    fitnessScore: 85, weightLoss: '↓ 2.8 kg', weightCurrent: '68.4', weightTrend: '0,18 20,24 40,12 60,20 80,8 100,16 120,6 150,14',
    strengthGain: '+18%', strengthRadar: '50,10 86,34 73,80 27,80 14,34', workoutCompletion: 76, caloriesAvg: 420, caloriesData: [55, 35, 70, 45, 90, 60, 100],
    recoveryTrend: '0,30 20,20 40,26 60,12 80,18 100,6 120,14 150,4', proteinPct: 0.92, caloriesPct: 0.87, waterPct: 0.95,
    achievements: [{ num: '100', label: 'Workouts' }, { num: '5KG', label: 'Lost' }, { num: '30', label: 'Day Streak' }]
  },
  '90D': {
    fitnessScore: 89, weightLoss: '↓ 6.2 kg', weightCurrent: '65.0', weightTrend: '0,35 20,30 40,25 60,28 80,15 100,10 120,8 150,2',
    strengthGain: '+35%', strengthRadar: '50,8 90,34 85,86 15,86 10,34', workoutCompletion: 92, caloriesAvg: 460, caloriesData: [70, 80, 65, 85, 95, 80, 110],
    recoveryTrend: '0,40 20,30 40,35 60,20 80,15 100,10 120,5 150,2', proteinPct: 0.96, caloriesPct: 0.94, waterPct: 0.98,
    achievements: [{ num: '300', label: 'Workouts' }, { num: '10KG', label: 'Lost' }, { num: '90', label: 'Day Streak' }]
  },
  '1Y': {
    fitnessScore: 94, weightLoss: '↓ 15.0 kg', weightCurrent: '56.2', weightTrend: '0,80 20,70 40,60 60,50 80,40 100,30 120,20 150,10',
    strengthGain: '+85%', strengthRadar: '50,5 95,30 90,90 10,90 5,30', workoutCompletion: 88, caloriesAvg: 490, caloriesData: [85, 90, 75, 95, 100, 85, 120],
    recoveryTrend: '0,80 20,60 40,50 60,30 80,20 100,15 120,10 150,5', proteinPct: 0.98, caloriesPct: 0.95, waterPct: 0.99,
    achievements: [{ num: '1000', label: 'Workouts' }, { num: '20KG', label: 'Lost' }, { num: '365', label: 'Day Streak' }]
  }
};

const baseInput: AIInputPayload = {
  userProfile: { userId: 'USR001', name: 'Rahul', age: 22, gender: 'Male', height: 175, weight: 72.5, fitnessLevel: 'Beginner', currentGoal: 'Muscle Gain', workoutPlan: { planId: 'PLAN-HYP-01', planName: 'Push-Pull-Legs Routine', frequencyPerWeek: 4, targetCaloriesBurnPerSession: 400, targetSleepPerNight: 8.0, targetWaterPerDay: 3.0, targetStepsPerDay: 8000 } },
  todayProgress: { date: new Date().toISOString().split('T')[0], workoutCompleted: true, workoutType: 'Chest & Triceps', workoutDuration: 65, caloriesBurned: 450, caloriesConsumed: 2800, steps: 9200, sleepHours: 6.5, waterIntake: 2.2, mood: 'Tired', energyLevel: 5, injury: { hasInjury: true, painLevel: 3, details: 'Slight pinch in left shoulder during bench press.' }, notes: 'Solid strength but fatigued in final sets. Left shoulder tender on high volumes.' },
  previousHistory: []
};

const baseReport: AIReport = {
  progressScore: 82, confidenceScore: 0.95,
  consistencyAnalysis: { status: 'On Track', completedWorkoutsCount: 5, missedWorkoutsCount: 2, weeklyAdherencePercentage: 83.3 },
  workoutPerformance: { intensityLevel: 'Moderate', caloriesBurnedVariance: 12.5, durationVariance: 7.6, feedback: 'Pushed through Chest & Triceps with solid duration.' },
  recoveryAnalysis: { status: 'Adequate', sleepQuality: 'Fair', hydrationStatus: 'Sub-optimal', fatigueLevel: 'Medium', insights: ['Sleep (6.5h) was 18.7% below target.', 'Water intake (2.2L) fell 800ml short.'] },
  injuryRisk: { riskLevel: 'Moderate', criticalAreas: ['Left Shoulder'], preventativeAction: 'Substitute with neutral-grip press.' },
  userVulnerabilities: ['Chronic dehydration', 'Recurring left shoulder stress'],
  improvementAnalysis: { isImproving: true, metricChanges: ['Workout duration increased 58→65 min'], primaryBottleneck: 'Dehydration is slowing recovery.' },
  goalProgress: { status: 'On Track', estimatedWeeksToGoal: 12, qualitativeAssessment: 'Caloric surplus supports muscle-building.' },
  personalizedRecommendations: [
    { category:'Recovery', priority:'High', action:'Drink 3.0L of water today.', rationale:'Compensates for workout fluid loss.' },
    { category:'Safety', priority:'High', action:'Warm up rotator cuff 10 min.', rationale:'Protects anterior deltoid.' }
  ],
  motivationMessage: "Solid work today, Rahul! Keep it up."
};

export const MOCK_REPORTS: Record<string, AIReport> = {
  '7D': { ...baseReport, progressScore: 78, consistencyAnalysis: { ...baseReport.consistencyAnalysis, completedWorkoutsCount: 5, missedWorkoutsCount: 2, weeklyAdherencePercentage: 71 }, motivationMessage: "Good start to the week, focus on hydration!" },
  '30D': { ...baseReport, progressScore: 85, consistencyAnalysis: { ...baseReport.consistencyAnalysis, completedWorkoutsCount: 19, missedWorkoutsCount: 6, weeklyAdherencePercentage: 76 }, motivationMessage: "Solid work today, Rahul! Your consistency is outstanding this month." },
  '90D': { ...baseReport, progressScore: 89, consistencyAnalysis: { ...baseReport.consistencyAnalysis, completedWorkoutsCount: 65, missedWorkoutsCount: 10, weeklyAdherencePercentage: 86 }, motivationMessage: "Incredible 90-day progress! You've lost significant weight and built strength." },
  '1Y': { ...baseReport, progressScore: 94, consistencyAnalysis: { ...baseReport.consistencyAnalysis, completedWorkoutsCount: 280, missedWorkoutsCount: 30, weeklyAdherencePercentage: 90 }, motivationMessage: "A full year of dedication! You are performing at an elite consistency level." },
};

export const MOCK_INPUTS: Record<string, AIInputPayload> = {
  '7D': baseInput, '30D': baseInput, '90D': baseInput, '1Y': baseInput
};

export const mockData = baseInput;
export const mockReport = baseReport;
