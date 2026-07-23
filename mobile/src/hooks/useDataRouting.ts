import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { AIInputPayload, AIReport, AppState, ProgressFormState } from '../types/progress';
import { mockData, mockReport, MOCK_INPUTS, MOCK_REPORTS, MOCK_CHARTS, ChartData } from '../mockData';

const KEYS = {
  progress: '@fitaix:progress',
  report:   '@fitaix:report',
};

const API = 'https://api.fitaix.app/v1';

async function fetchWithTimeout(url: string, opts: RequestInit = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

export function useDataRouting(segment: string = '30D') {
  const [state, setState] = useState<AppState & { chartData: ChartData | null }>({
    data: null, aiReport: null, chartData: null,
    isLoading: true, isSubmitting: false,
    error: null, submitError: null,
    source: 'mock', isOnline: false,
  });

  const load = useCallback(async () => {
    setState(p => ({ ...p, isLoading: true, error: null }));
    const net = await NetInfo.fetch();
    const online = !!(net.isConnected && net.isInternetReachable);

    const currentChartData = MOCK_CHARTS[segment] || MOCK_CHARTS['30D'];
    const currentReport = MOCK_REPORTS[segment] || MOCK_REPORTS['30D'];
    const currentInput = MOCK_INPUTS[segment] || MOCK_INPUTS['30D'];

    try {
      if (online) {
        const res = await fetchWithTimeout(`${API}/progress/today?segment=${segment}`);
        if (!res.ok) throw new Error(`API ${res.status}`);
        const data: AIInputPayload = await res.json();
        await AsyncStorage.setItem(KEYS.progress, JSON.stringify(data));
        setState(p => ({ ...p, data, aiReport: currentReport, chartData: currentChartData, isLoading: false, source: 'api', isOnline: true }));
      } else {
        const raw = await AsyncStorage.getItem(KEYS.progress);
        const rawR = await AsyncStorage.getItem(KEYS.report);
        setState(p => ({
          ...p,
          data: raw ? JSON.parse(raw) : currentInput,
          aiReport: rawR ? JSON.parse(rawR) : currentReport,
          chartData: currentChartData,
          isLoading: false,
          source: raw ? 'asyncstorage' : 'mock',
          isOnline: false,
        }));
      }
    } catch {
      const raw = await AsyncStorage.getItem(KEYS.progress);
      setState(p => ({
        ...p,
        data: raw ? JSON.parse(raw) : currentInput,
        aiReport: currentReport,
        chartData: currentChartData,
        isLoading: false, error: null,
        source: raw ? 'asyncstorage' : 'mock',
        isOnline: online,
      }));
    }
  }, [segment]);

  const submit = useCallback(async (form: ProgressFormState) => {
    if (!state.data) return;
    setState(p => ({ ...p, isSubmitting: true, submitError: null }));

    const today = {
      date: new Date().toISOString().split('T')[0],
      workoutCompleted: form.workoutCompleted,
      workoutType: form.workoutCompleted ? form.workoutType : null,
      workoutDuration: form.workoutCompleted ? (parseInt(form.workoutDuration) || 0) : 0,
      caloriesBurned:  parseInt(form.caloriesBurned)  || 0,
      caloriesConsumed:parseInt(form.caloriesConsumed) || 0,
      steps:           parseInt(form.steps)            || 0,
      sleepHours:      parseFloat(form.sleepHours)     || 0,
      waterIntake:     parseFloat(form.waterIntake)    || 0,
      mood: form.mood,
      energyLevel: form.energyLevel,
      injury: { hasInjury: form.hasInjury, painLevel: form.hasInjury ? form.painLevel : 0, details: form.injuryDetails },
      notes: form.notes,
    };

    const payload: AIInputPayload = { userProfile: state.data.userProfile, todayProgress: today, previousHistory: state.data.previousHistory };
    const net = await NetInfo.fetch();
    const online = !!(net.isConnected && net.isInternetReachable);

    const currentReport = MOCK_REPORTS[segment] || MOCK_REPORTS['30D'];

    try {
      if (online) {
        const res = await fetchWithTimeout(`${API}/progress/submit`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Submit ${res.status}`);
        const report: AIReport = await res.json();
        await AsyncStorage.setItem(KEYS.progress, JSON.stringify(payload));
        await AsyncStorage.setItem(KEYS.report,   JSON.stringify(report));
        setState(p => ({ ...p, data: payload, aiReport: report, isSubmitting: false, source: 'api' }));
      } else {
        await AsyncStorage.setItem(KEYS.progress, JSON.stringify(payload));
        setState(p => ({ ...p, data: payload, aiReport: currentReport, isSubmitting: false, source: 'asyncstorage' }));
      }
    } catch {
      try { await AsyncStorage.setItem(KEYS.progress, JSON.stringify(payload)); } catch {}
      setState(p => ({ ...p, data: payload, aiReport: currentReport, isSubmitting: false }));
    }
  }, [state.data, segment]);

  useEffect(() => {
    const unsub = NetInfo.addEventListener(n => {
      setState(p => ({ ...p, isOnline: !!(n.isConnected && n.isInternetReachable) }));
    });
    return () => unsub();
  }, []);

  useEffect(() => { load(); }, [load]);

  return { ...state, submit, reload: load };
}
