// STEP 2: useDataRouting.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {
  AIReport,
  AnalyticsResponse,
  AnalyticsTrendEntry,
  AppState,
  OfflineQueueEntry,
  ProgressFormState,
  ProgressLogRequest,
  ProgressLogResponse,
  ChartData,
} from '../types/progress';
const KEYS = {
  profile:       '@fitaix:profile',
  analytics:     '@fitaix:analytics', 
  report:        '@fitaix:report',
  offlineQueue:  '@fitaix:offlineQueue',
} as const;

const analyticsKey = (seg: string) => `${KEYS.analytics}:${seg}`;

// Using local EXPO_PUBLIC_API_URL routing (no localhost)
const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.100:3000';

const SEGMENT_RANGE: Record<string, string> = {
  '7D':  '7d',
  '30D': '30d',
  '90D': '90d',
  '1Y':  '90d', 
};

function analyticsToChartData(analytics: any, seg: string): ChartData {
  if (!analytics || !analytics.aggregates) {
    return {
      streakDays: 0, fitnessScore: 0, weightLoss: '0 kg', weightCurrent: '0',
      weightTrend: '0,30 150,30', strengthGain: '+0%', strengthRadar: '50,50 50,50 50,50 50,50 50,50',
      workoutCompletion: 0, caloriesAvg: 0, caloriesData: [0, 0, 0, 0, 0, 0, 0], caloriesLabels: ['M','T','W','T','F','S','S'],
      recoveryTrend: '0,30 150,30', proteinPct: 0, caloriesPct: 0, waterPct: 0, achievements: []
    };
  }

  const agg   = analytics.aggregates;
  const trend = analytics.trendData ?? [];

  function buildSparkline(values: number[], width = 150, height = 30): string {
    if (!values.length) return '0,30 150,30';
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    return values
      .map((v, i) => {
        const x = Math.round((i / Math.max(values.length - 1, 1)) * width);
        const y = Math.round(height - ((v - min) / range) * height);
        return `${x},${y}`;
      })
      .join(' ');
  }

  function buildRadar(e: number, s: number, w: number, st: number, c: number): string {
    const norm = [
      Math.min(e / 10, 1), Math.min(s / 9, 1), Math.min(w / 4, 1),
      Math.min(st / 12000, 1), Math.min(c / 500, 1),
    ];
    const cx = 50, cy = 50, r = 40;
    const angles = [270, 342, 54, 126, 198];
    return norm.map((v, i) => {
        const angle = (angles[i] * Math.PI) / 180;
        const x = Math.round((cx + v * r * Math.cos(angle)) * 10) / 10;
        const y = Math.round((cy + v * r * Math.sin(angle)) * 10) / 10;
        return `${x},${y}`;
      }).join(' ');
  }

  let caloriesData: number[] = [0,0,0,0,0,0,0];
  let caloriesLabels: string[] = ['M','T','W','T','F','S','S'];

  if (trend.length > 0) {
    if (seg === '7D') {
      const recent = trend.slice(-7);
      caloriesData = recent.map((d: AnalyticsTrendEntry) => d.caloriesBurned || 0);
      caloriesLabels = recent.map((d: AnalyticsTrendEntry) => {
        const date = new Date(d.date);
        return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('en-US', { weekday: 'narrow' });
      });
      while (caloriesData.length < 7) {
        caloriesData.unshift(0);
        caloriesLabels.unshift('-');
      }
    } else if (seg === '30D') {
      caloriesData = [0, 0, 0, 0];
      caloriesLabels = ['W1', 'W2', 'W3', 'W4'];
      const recent = trend.slice(-28);
      recent.forEach((d: AnalyticsTrendEntry, i: number) => {
        const week = Math.floor(i / 7);
        caloriesData[week] += (d.caloriesBurned || 0);
      });
    } else {
      const monthTotals: Record<string, number> = {};
      const monthOrder: string[] = [];
      trend.forEach((d: AnalyticsTrendEntry) => {
        const date = new Date(d.date);
        if (!isNaN(date.getTime())) {
          const m = date.toLocaleDateString('en-US', { month: 'short' });
          if (monthTotals[m] === undefined) {
             monthTotals[m] = 0;
             monthOrder.push(m);
          }
          monthTotals[m] += (d.caloriesBurned || 0);
        }
      });
      caloriesLabels = monthOrder;
      caloriesData = monthOrder.map(m => monthTotals[m]);
      if (caloriesLabels.length === 0) {
        caloriesLabels = ['-'];
        caloriesData = [0];
      }
    }
  }
  const weightTrendPoints   = buildSparkline(trend.map((d: AnalyticsTrendEntry) => d.progressScore));
  const recoveryTrendPoints = buildSparkline(trend.map((d: AnalyticsTrendEntry) => d.sleepHours * 10));
  const radarPoints         = buildRadar(
    agg.averageEnergyLevel || 0, agg.averageSleepHours || 0, agg.averageWaterIntake || 0,
    agg.averageStepsPerDay || 0, agg.averageCaloriesBurned || 0
  );

  const fitnessScore = agg.averageProgressScore > 0 ? Math.round(Math.min(Math.max(agg.averageProgressScore, 0), 100)) : 0;
  const workoutCompletion = agg.workoutAdherenceRate > 0 ? Math.round(agg.workoutAdherenceRate) : 0;

  const avgCalLabel = agg.averageCaloriesBurned > 0 ? `↑ ${Math.round(agg.averageCaloriesBurned)} kcal avg` : '0 kcal';
  const weightCurrentDisplay = analytics.userWeight ? String(analytics.userWeight) : '0';

  const strengthGain = agg.averageEnergyLevel > 0 ? `+${Math.round((agg.averageEnergyLevel / 10) * 100)}%` : '+0%';
  const streakDays = agg.workoutsCompleted > 0 ? agg.workoutsCompleted : 0;

  const achievements = (agg.workoutsCompleted > 0 || trend.length > 0) ? [
    { num: String(agg.workoutsCompleted || 0), label: 'Workouts' },
    { num: `${Math.round(agg.workoutAdherenceRate || 0)}%`, label: 'Adherence' },
    { num: String(Math.round(agg.averageProgressScore || 0)), label: 'Avg Score' },
  ] : [];

  return {
    streakDays,
    fitnessScore,
    weightLoss:       avgCalLabel,
    weightCurrent:    weightCurrentDisplay,
    weightTrend:      weightTrendPoints,
    strengthGain,
    strengthRadar:    radarPoints,
    workoutCompletion,
    caloriesAvg:      agg.averageCaloriesBurned > 0 ? Math.round(agg.averageCaloriesBurned) : 0,
    caloriesData,
    caloriesLabels,
    recoveryTrend:    recoveryTrendPoints,
    proteinPct:       agg.proteinCompliance  > 0 ? Math.min(agg.proteinCompliance,  1) : 0,
    caloriesPct:      agg.calorieCompliance  > 0 ? Math.min(agg.calorieCompliance,  1) : 0,
    waterPct:         agg.waterCompliance    > 0 ? Math.min(agg.waterCompliance,    1) : 0,
    achievements,
  };
}

export function useDataRouting(segment: string = '30D') {
  const [state, setState] = useState<AppState>({
    data: null,
    aiReport: null,
    analytics: null,
    isLoading: true,
    isSubmitting: false,
    error: null,
    submitError: null,
    submitSuccess: false,
    source: 'api',
    isOnline: true,
  });

  const [chartData, setChartData] = useState<ChartData | null>(null);
  const isInitialMount = useRef(true);

  const loadData = useCallback(async () => {
    setState(p => ({ ...p, isLoading: true, error: null }));
    const net = await NetInfo.fetch();
    const isOnline = !!net.isConnected;
    const rangeParam = SEGMENT_RANGE[segment] ?? '30d';

    if (isOnline) {
      try {
        const [analyticsRes, reportCached] = await Promise.all([
          fetch(`${API_BASE}/api/progress/analytics?range=${rangeParam}`),
          AsyncStorage.getItem(KEYS.report)
        ]);

        if (!analyticsRes.ok) throw new Error('API fetch failed');
        const analyticsJson = await analyticsRes.json();
        const analyticsData = analyticsJson.data as AnalyticsResponse;

        await AsyncStorage.setItem(analyticsKey(segment), JSON.stringify(analyticsData));

        const parsedReport = reportCached ? JSON.parse(reportCached) : null;

        setState(p => ({
          ...p,
          analytics: analyticsData,
          aiReport: parsedReport,
          source: 'api',
          isOnline: true,
          isLoading: false,
        }));
      } catch (err) {
        const cachedAnalytics = await AsyncStorage.getItem(analyticsKey(segment));
        const cachedReport    = await AsyncStorage.getItem(KEYS.report);
        
        setState(p => ({
          ...p,
          analytics: cachedAnalytics ? JSON.parse(cachedAnalytics) : null,
          aiReport: cachedReport ? JSON.parse(cachedReport) : null,
          source: 'asyncstorage',
          isOnline: false,
          isLoading: false,
          error: 'Using offline data'
        }));
      }
    } else {
      const cachedAnalytics = await AsyncStorage.getItem(analyticsKey(segment));
      const cachedReport    = await AsyncStorage.getItem(KEYS.report);

      setState(p => ({
        ...p,
        analytics: cachedAnalytics ? JSON.parse(cachedAnalytics) : null,
        aiReport: cachedReport ? JSON.parse(cachedReport) : null,
        source: 'asyncstorage',
        isOnline: false,
        isLoading: false,
      }));
    }
  }, [segment]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      loadData();
    } else {
      loadData();
    }
  }, [loadData]);

  useEffect(() => {
    if (state.analytics) {
      setChartData(analyticsToChartData(state.analytics, segment));
    } else if (!state.isLoading) {
      setChartData(analyticsToChartData(null, segment));
    }
  }, [state.analytics, segment, state.isLoading]);

  const enqueue = async (req: ProgressLogRequest) => {
    try {
      const q = await AsyncStorage.getItem(KEYS.offlineQueue);
      const arr: OfflineQueueEntry[] = q ? JSON.parse(q) : [];
      arr.push({ payload: req, queuedAt: new Date().toISOString() });
      await AsyncStorage.setItem(KEYS.offlineQueue, JSON.stringify(arr));
    } catch {}
  };

  const submit = async (form: ProgressFormState) => {
    setState(p => ({ ...p, isSubmitting: true, submitError: null, submitSuccess: false }));

    const request: ProgressLogRequest = {
      workoutCompleted: form.workoutCompleted,
      workoutType:      form.workoutCompleted ? form.workoutType : '',
      workoutDuration:  form.workoutCompleted ? parseInt(form.workoutDuration) || 0 : 0,
      caloriesBurned:   form.workoutCompleted ? parseInt(form.caloriesBurned) || 0 : 0,
      caloriesConsumed: parseInt(form.caloriesConsumed) || 0,
      steps:            parseInt(form.steps) || 0,
      sleepHours:       parseFloat(form.sleepHours) || 0,
      waterIntake:      parseFloat(form.waterIntake) || 0,
      mood:             form.mood,
      energyLevel:      form.energyLevel,
      injury: {
        hasInjury: form.hasInjury,
        painLevel: form.hasInjury ? form.painLevel : 0,
      },
      notes: form.notes,
    };

    const net = await NetInfo.fetch();
    const isOnline = !!net.isConnected;

    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE}/api/progress/log`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body:   JSON.stringify(request),
        });

        // Strict 409 DUPLICATE_LOG Catch defined by API CONTRACT
        if (res.status === 409) {
          const body = await res.json().catch(() => ({ message: 'Duplicate log' })) as { message?: string };
          throw new Error(body?.message ?? 'Today\'s metrics have already been recorded. Use PUT request to modify today\'s log.');
        }

        if (res.status === 400) {
          const body = await res.json().catch(() => ({ message: 'Validation failed' })) as { message?: string };
          throw new Error(body?.message ?? 'Invalid form data — please review your entries.');
        }

        if (res.status === 201 || res.ok) {
          const body   = (await res.json()) as ProgressLogResponse;
          const report = body.data.report;
          await AsyncStorage.setItem(KEYS.report, JSON.stringify(report)).catch(() => {});

          setState(p => ({
            ...p,
            aiReport:      report,
            isSubmitting:  false,
            submitSuccess: true,
            source:        'api',
          }));
        } else {
          await enqueue(request).catch(() => {});
          setState(p => ({
            ...p,
            isSubmitting:  false,
            submitSuccess: true,
            source:        'asyncstorage',
          }));
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : null;
        if (msg && (msg.includes('Invalid form data') || msg.includes('recorded'))) {
          setState(p => ({ ...p, isSubmitting: false, submitError: msg }));
          throw err;
        } else {
          await enqueue(request).catch(() => {});
          setState(p => ({
            ...p,
            isSubmitting:  false,
            submitSuccess: true,
            source:        'asyncstorage',
          }));
        }
      }
    } else {
      await enqueue(request).catch(() => {});
      setState(p => ({
        ...p,
        isSubmitting:  false,
        submitSuccess: true,
        source:        'asyncstorage',
      }));
    }
  };

  const clearSubmitStatus = () => {
    setState(p => ({ ...p, submitError: null, submitSuccess: false }));
  };

  return {
    ...state,
    chartData,
    submit,
    reload: loadData,
    clearSubmitStatus,
  };
}