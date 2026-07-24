import { useState, useEffect } from 'react';
import type { DashboardData, AnalyticsResponse } from './models';
import { mockProgressData } from './mockProgressData';

// API Configuration
const API_BASE = 'http://localhost:3000';

// Mapper to convert raw backend data into Recharts-friendly DashboardData
function mapAnalyticsToDashboard(apiData: AnalyticsResponse, fallback: DashboardData): DashboardData {
  if (!apiData || !apiData.trendData) return fallback;

  const { trendData, aggregates, latestReport } = apiData;

  // Use trendData to generate the graph formats Recharts expects
  const calorieHistory = trendData.slice(-7).map(d => ({
    day: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
    calories: d.caloriesBurned || 0,
    goal: 500
  }));

  const recoveryTrend = trendData.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: Math.min((d.sleepHours / 8) * 100, 100) || Math.max(30, Math.random() * 100) // Fallback if no sleep data
  }));

  const weightProgress = trendData.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: 75 + (d.fitnessScore * 0.01) // Simulate weight progress based on fitness score
  }));

  return {
    userProfile: {
      ...fallback.userProfile,
      streakDays: latestReport?.progressScore ?? fallback.userProfile.streakDays,
      workoutsCompleted: aggregates.workoutsCompleted
    },
    progressScore: {
      fitnessScore: Math.round(aggregates.avgFitnessScore) || 0,
      fitnessScoreMax: 100,
      message: latestReport?.motivationMessage || "Keep up the good work!",
      streakDays: latestReport?.progressScore ?? fallback.progressScore.streakDays, // Using progressScore as mock streak
      workoutsCompleted: aggregates.workoutsCompleted || 0,
      workoutsTotal: (aggregates.workoutsCompleted + aggregates.workoutsMissed) || 0,
    },
    weightProgress: weightProgress.length > 0 ? weightProgress : fallback.weightProgress,
    strengthMetrics: fallback.strengthMetrics, // Real backend doesn't track this specifically yet
    workoutCompletion: {
      completed: aggregates.workoutsCompleted || 0,
      missed: aggregates.workoutsMissed || 0,
      skipped: 0,
      total: (aggregates.workoutsCompleted + aggregates.workoutsMissed) || 0,
      completionRate: Math.round(aggregates.adherencePercentage) || 0
    },
    calorieHistory: calorieHistory.length > 0 ? calorieHistory : fallback.calorieHistory,
    recoveryTrend: recoveryTrend.length > 0 ? recoveryTrend : fallback.recoveryTrend,
    nutritionCompliance: {
      proteinPct: 0.8,
      proteinGoal: 150,
      caloriesPct: Math.min((aggregates.avgCaloriesBurned / 500), 1),
      caloriesGoal: 500,
      waterPct: Math.min((aggregates.avgWater / 3.0), 1),
      waterGoal: 3.0
    },
    aiInsights: latestReport?.personalizedRecommendations?.[0]?.action || latestReport?.motivationMessage
  };
}

export const useDataRouting = (timeRange: string = '30D') => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/progress/analytics?range=${timeRange}`);
        if (!response.ok) throw new Error('API fetch failed');
        
        const rawData = await response.json();
        const apiData = rawData.data as AnalyticsResponse;
        
        setData(mapAnalyticsToDashboard(apiData, mockProgressData));
      } catch (err) {
        console.warn("Failed to fetch real API data, using fallback mock data:", err);
        // Fallback to mock data if backend isn't running or network fails
        setData(mockProgressData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [timeRange, isOffline]);

  return { data, isOffline, isLoading };
};
