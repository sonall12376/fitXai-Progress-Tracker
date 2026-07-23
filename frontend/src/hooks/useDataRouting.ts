'use client';
// =============================================================================
// FitAI-X — useDataRouting Hook
// Conditional routing:
//   ONLINE  → Skip IndexedDB → Call PostgreSQL REST API directly
//   OFFLINE → Skip API       → Use IndexedDB only
// =============================================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ProgressDashboardData, TimeRange } from '@/types/progress';
import { getMockProgressData } from '@/mock/mockProgressData';
import {
  getProgressData,
  postProgressData,
  putProgressData,
  deleteProgressData,
} from '@/api/progress';
import {
  saveToIndexedDB,
  getFromIndexedDB,
  updateIndexedDB,
  deleteIndexedDB,
} from '@/lib/indexedDB';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface DataRoutingState {
  data: ProgressDashboardData | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  isOnline: boolean;
  isUsingCache: boolean;
}

interface DataRoutingActions {
  refetch: () => Promise<void>;
  submitProgress: (payload: Partial<ProgressDashboardData>) => Promise<void>;
  updateProgress: (payload: Partial<ProgressDashboardData>) => Promise<void>;
  removeProgress: () => Promise<void>;
}

export type UseDataRoutingReturn = DataRoutingState & DataRoutingActions;

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useDataRouting(
  userId: string,
  timeRange: TimeRange,
  useMockData = true // Set false in production to use real API/IndexedDB
): UseDataRoutingReturn {
  const [state, setState] = useState<DataRoutingState>({
    data: null,
    isLoading: true,
    isError: false,
    errorMessage: null,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isUsingCache: false,
  });

  // Track online/offline status reactively
  const isOnlineRef = useRef<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => {
      isOnlineRef.current = true;
      setState((prev) => ({ ...prev, isOnline: true }));
    };
    const handleOffline = () => {
      isOnlineRef.current = false;
      setState((prev) => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Core fetch function — implements conditional routing logic
  // ---------------------------------------------------------------------------
  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, isError: false, errorMessage: null }));

    try {
      // BRANCH 1: Mock data mode (development / demo)
      if (useMockData) {
        const mockData = getMockProgressData(timeRange);
        setState((prev) => ({
          ...prev,
          data: mockData,
          isLoading: false,
          isUsingCache: false,
        }));
        return;
      }

      // BRANCH 2: ONLINE → Skip IndexedDB → Call PostgreSQL API directly
      if (isOnlineRef.current) {
        // ---------------------------------------------------------------
        // REAL API CALL — Replace with actual PostgreSQL endpoint
        // ---------------------------------------------------------------
        const apiData = await getProgressData(userId, timeRange);

        // Cache to IndexedDB for offline fallback
        await saveToIndexedDB(userId, timeRange, apiData);
        // ---------------------------------------------------------------

        setState((prev) => ({
          ...prev,
          data: apiData,
          isLoading: false,
          isUsingCache: false,
        }));
        return;
      }

      // BRANCH 3: OFFLINE → Skip API → Use IndexedDB ONLY
      // ---------------------------------------------------------------
      // INDEXEDDB READ — Replace with actual idb read implementation
      // ---------------------------------------------------------------
      const cachedData = await getFromIndexedDB(userId, timeRange);
      // ---------------------------------------------------------------

      if (cachedData) {
        setState((prev) => ({
          ...prev,
          data: cachedData,
          isLoading: false,
          isUsingCache: true,
        }));
      } else {
        // No cache available — fall back to mock data gracefully
        const fallback = getMockProgressData(timeRange);
        setState((prev) => ({
          ...prev,
          data: fallback,
          isLoading: false,
          isUsingCache: true,
          isError: true,
          errorMessage: 'Offline — using demo data. Cached data unavailable.',
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('[useDataRouting] Fetch failed:', errorMessage);

      // Graceful degradation → try IndexedDB cache on API failure
      try {
        const cachedData = await getFromIndexedDB(userId, timeRange);
        if (cachedData) {
          setState((prev) => ({
            ...prev,
            data: cachedData,
            isLoading: false,
            isUsingCache: true,
            isError: true,
            errorMessage: `API error — showing cached data. (${errorMessage})`,
          }));
          return;
        }
      } catch {
        // IndexedDB also failed — last resort: mock data
      }

      setState((prev) => ({
        ...prev,
        isLoading: false,
        isError: true,
        errorMessage,
      }));
    }
  }, [userId, timeRange, useMockData]);

  // Trigger fetch on mount and when dependencies change
  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  // ---------------------------------------------------------------------------
  // Mutations
  // ---------------------------------------------------------------------------

  // POST — submit new progress log
  const submitProgress = useCallback(
    async (payload: Partial<ProgressDashboardData>): Promise<void> => {
      if (isOnlineRef.current && !useMockData) {
        // ONLINE → POST /api/progress
        await postProgressData(payload);
      } else if (!useMockData) {
        // OFFLINE → Save to IndexedDB ONLY (DO NOT CALL API)
        // PLACE ACTUAL IndexedDB implementation here
        await saveToIndexedDB(userId, timeRange, payload as ProgressDashboardData);
      }
      await fetchData();
    },
    [userId, timeRange, fetchData, useMockData]
  );

  // PUT — update existing record
  const updateProgress = useCallback(
    async (payload: Partial<ProgressDashboardData>): Promise<void> => {
      if (isOnlineRef.current && !useMockData) {
        // ONLINE → PUT /api/progress/:userId
        await putProgressData(userId, payload);
      } else if (!useMockData) {
        // OFFLINE → Update IndexedDB ONLY (DO NOT CALL API)
        // PLACE ACTUAL IndexedDB update implementation here
        await updateIndexedDB(userId, timeRange, payload);
      }
      await fetchData();
    },
    [userId, timeRange, fetchData, useMockData]
  );

  // DELETE — remove record
  const removeProgress = useCallback(async (): Promise<void> => {
    if (isOnlineRef.current && !useMockData) {
      // ONLINE → DELETE /api/progress/:userId
      await deleteProgressData(userId);
    } else if (!useMockData) {
      // OFFLINE → Delete from IndexedDB ONLY (DO NOT CALL API)
      // PLACE ACTUAL IndexedDB delete implementation here
      await deleteIndexedDB(userId, timeRange);
    }
    await fetchData();
  }, [userId, timeRange, fetchData, useMockData]);

  return {
    ...state,
    refetch: fetchData,
    submitProgress,
    updateProgress,
    removeProgress,
  };
}
