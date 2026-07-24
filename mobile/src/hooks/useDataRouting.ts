// STEP 2 — useDataRouting.ts
// Offline-first hook: bridges API ↔ AsyncStorage ↔ mock data

import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {
  AIInputPayload,
  AIReport,
  AnalyticsResponse,
  AppState,
  OfflineQueueEntry,
  ProgressFormState,
  ProgressLogRequest,
  ProgressLogResponse,
} from '../types/progress';
import { mockData, mockReport, MOCK_INPUTS, MOCK_REPORTS, MOCK_CHARTS, ChartData } from '../mockData';

// ── AsyncStorage Key Registry ────────────────────────────────
const KEYS = {
  profile:       '@fitaix:profile',
  analytics:     '@fitaix:analytics',        // keyed by segment
  report:        '@fitaix:report',
  offlineQueue:  '@fitaix:offlineQueue',
  jwt:           '@fitaix:jwt',
} as const;

const analyticsKey = (seg: string) => `${KEYS.analytics}:${seg}`;

// ── Backend base URL ─────────────────────────────────────────
// For Android Emulator: http://10.0.2.2:3000 | For iOS / Web / Local: http://localhost:3000
const API_BASE = 'http://192.168.12.100:3000';

// ── Segment → query param map ────────────────────────────────
const SEGMENT_RANGE: Record<string, string> = {
  '7D':  '7d',
  '30D': '30d',
  '90D': '90d',
  '1Y':  '90d',  // backend supports up to 90d; 1Y uses same max range
};

// ── Abort-safe fetch with timeout ────────────────────────────
async function apiFetch(
  path: string,
  opts: RequestInit = {},
  timeoutMs = 10_000,
): Promise<Response> {
  const jwt = await AsyncStorage.getItem(KEYS.jwt).catch(() => null);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    return await fetch(`${API_BASE}${path}`, {
      ...opts,
      signal: ctrl.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
        ...(opts.headers ?? {}),
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

// ── Offline queue helpers ────────────────────────────────────
async function readQueue(): Promise<OfflineQueueEntry[]> {
  const raw = await AsyncStorage.getItem(KEYS.offlineQueue).catch(() => null);
  return raw ? (JSON.parse(raw) as OfflineQueueEntry[]) : [];
}

async function writeQueue(q: OfflineQueueEntry[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.offlineQueue, JSON.stringify(q));
}

async function enqueue(payload: ProgressLogRequest): Promise<void> {
  const q = await readQueue();
  q.push({ payload, queuedAt: new Date().toISOString() });
  await writeQueue(q);
}

// Attempts to flush offline queue — best effort, swallows errors
async function flushQueue(): Promise<void> {
  const q = await readQueue();
  if (!q.length) return;

  const remaining: OfflineQueueEntry[] = [];
  for (const entry of q) {
    try {
      const res = await apiFetch('/api/progress/log', {
        method: 'POST',
        body: JSON.stringify(entry.payload),
      });
      if (!res.ok) remaining.push(entry);
    } catch {
      remaining.push(entry);
    }
  }
  await writeQueue(remaining);
}

// ── Form → API request converter ────────────────────────────
function formToRequest(form: ProgressFormState): ProgressLogRequest {
  return {
    workoutCompleted:  form.workoutCompleted,
    workoutType:       form.workoutType,
    workoutDuration:   parseInt(form.workoutDuration, 10)   || 0,
    caloriesBurned:    parseInt(form.caloriesBurned, 10)    || 0,
    caloriesConsumed:  parseInt(form.caloriesConsumed, 10)  || 0,
    steps:             parseInt(form.steps, 10)             || 0,
    sleepHours:        parseFloat(form.sleepHours)          || 0,
    waterIntake:       parseFloat(form.waterIntake)         || 0,
    mood:              form.mood,
    energyLevel:       form.energyLevel,
    injury: {
      hasInjury:  form.hasInjury,
      painLevel:  form.hasInjury ? form.painLevel : 0,
    },
    notes: form.notes,
  };
}

// ── Hook ─────────────────────────────────────────────────────
export function useDataRouting(segment: string = '30D') {
  const [state, setState] = useState<AppState & { chartData: ChartData | null }>({
    data:          null,
    aiReport:      null,
    analytics:     null,
    chartData:     null,
    isLoading:     true,
    isSubmitting:  false,
    error:         null,
    submitError:   null,
    submitSuccess: false,
    source:        'mock',
    isOnline:      false,
  });

  // Prevent stale segment inside async callbacks
  const segRef = useRef(segment);
  useEffect(() => { segRef.current = segment; }, [segment]);

  // ── Load ────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setState(p => ({ ...p, isLoading: true, error: null }));

    const net      = await NetInfo.fetch();
    const online   = !!(net.isConnected && net.isInternetReachable);
    const seg      = segRef.current;
    const range    = SEGMENT_RANGE[seg] ?? '30d';
    const chartFallback = MOCK_CHARTS[seg] ?? MOCK_CHARTS['30D'];
    const reportFallback = MOCK_REPORTS[seg] ?? MOCK_REPORTS['30D'];
    const dataFallback   = MOCK_INPUTS[seg]  ?? MOCK_INPUTS['30D'];

    if (online) {
      // ── Flush any queued offline submissions ───────────────
      flushQueue().catch(() => {/* best effort */});

      try {
        const res = await apiFetch(`/api/progress/analytics?range=${range}`);

        if (!res.ok) {
          // If server responds with 404 or non-200, fallback silently to local mock mode
          throw new Error(`Analytics API returned ${res.status}`);
        }

        const analytics = (await res.json()) as AnalyticsResponse;

        // Cache to AsyncStorage
        await AsyncStorage.setItem(analyticsKey(seg), JSON.stringify(analytics)).catch(() => {});

        setState(p => ({
          ...p,
          data:      dataFallback,
          analytics,
          aiReport:  reportFallback,
          chartData: chartFallback,
          isLoading: false,
          source:    'api',
          isOnline:  true,
        }));
      } catch {
        // Fallback to cache or mock on connection error or 404 without breaking UI
        const cached = await AsyncStorage.getItem(analyticsKey(seg)).catch(() => null);
        setState(p => ({
          ...p,
          data:      dataFallback,
          analytics: cached ? (JSON.parse(cached) as AnalyticsResponse) : null,
          aiReport:  reportFallback,
          chartData: chartFallback,
          isLoading: false,
          error:     null, // Keep UI clean in fallback mode
          source:    cached ? 'asyncstorage' : 'mock',
          isOnline:  true,
        }));
      }
    } else {
      // ── Offline: serve strictly from cache ─────────────────
      const cached     = await AsyncStorage.getItem(analyticsKey(seg)).catch(() => null);
      const cachedReport = await AsyncStorage.getItem(KEYS.report).catch(() => null);

      setState(p => ({
        ...p,
        data:      dataFallback,
        analytics: cached     ? (JSON.parse(cached) as AnalyticsResponse) : null,
        aiReport:  cachedReport ? (JSON.parse(cachedReport) as AIReport)  : reportFallback,
        chartData: chartFallback,
        isLoading: false,
        source:    cached ? 'asyncstorage' : 'mock',
        isOnline:  false,
      }));
    }
  }, [segment]);

  // ── Submit ──────────────────────────────────────────────────
  const submit = useCallback(async (form: ProgressFormState) => {
    setState(p => ({ ...p, isSubmitting: true, submitError: null, submitSuccess: false }));

    const request = formToRequest(form);
    const net     = await NetInfo.fetch();
    const online  = !!(net.isConnected && net.isInternetReachable);
    const seg     = segRef.current;
    const reportFallback = MOCK_REPORTS[seg] ?? MOCK_REPORTS['30D'];

    if (online) {
      try {
        const res = await apiFetch('/api/progress/log', {
          method: 'POST',
          body:   JSON.stringify(request),
        });

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
          // If server returns 404 or non-201, enqueue for later sync and generate local report
          await enqueue(request).catch(() => {});
          await AsyncStorage.setItem(KEYS.report, JSON.stringify(reportFallback)).catch(() => {});

          setState(p => ({
            ...p,
            aiReport:      reportFallback,
            isSubmitting:  false,
            submitSuccess: true,
            source:        'asyncstorage',
          }));
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : null;
        if (msg && msg.includes('Invalid form data')) {
          setState(p => ({ ...p, isSubmitting: false, submitError: msg }));
        } else {
          // On network connection error, fallback to local storage report
          await enqueue(request).catch(() => {});
          await AsyncStorage.setItem(KEYS.report, JSON.stringify(reportFallback)).catch(() => {});

          setState(p => ({
            ...p,
            aiReport:      reportFallback,
            isSubmitting:  false,
            submitSuccess: true,
            source:        'asyncstorage',
          }));
        }
      }
    } else {
      // ── Offline: enqueue and show mock report ──────────────
      await enqueue(request).catch(() => {});
      await AsyncStorage.setItem(KEYS.report, JSON.stringify(reportFallback)).catch(() => {});

      setState(p => ({
        ...p,
        aiReport:      reportFallback,
        isSubmitting:  false,
        submitSuccess: true,
        source:        'asyncstorage',
      }));
    }
  }, []);

  // ── Network listener ────────────────────────────────────────
  useEffect(() => {
    const unsub = NetInfo.addEventListener(n => {
      const isOnline = !!(n.isConnected && n.isInternetReachable);
      setState(p => ({ ...p, isOnline }));
      if (isOnline) flushQueue().catch(() => {});
    });
    return () => unsub();
  }, []);

  // ── Reload on segment change ─────────────────────────────────
  useEffect(() => { load(); }, [load]);

  const clearSubmitStatus = useCallback(() => {
    setState(p => ({ ...p, submitError: null, submitSuccess: false }));
  }, []);

  return { ...state, submit, reload: load, clearSubmitStatus };
}
