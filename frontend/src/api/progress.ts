// =============================================================================
// FitAI-X — PostgreSQL API Client
// Placeholder REST methods — replace base URL and auth headers in production
// =============================================================================

import type { ProgressDashboardData, TimeRange } from '@/types/progress';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api';

// ---------------------------------------------------------------------------
// Helper: typed fetch with error handling
// ---------------------------------------------------------------------------
async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      // Add Authorization: `Bearer ${token}` here in production
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// GET /api/progress?userId=&timeRange=
// Fetches merged dashboard data from PostgreSQL backend
// ---------------------------------------------------------------------------
export async function getProgressData(
  userId: string,
  timeRange: TimeRange
): Promise<ProgressDashboardData> {
  return apiFetch<ProgressDashboardData>(
    `/progress?userId=${encodeURIComponent(userId)}&timeRange=${encodeURIComponent(timeRange)}`
  );
}

// ---------------------------------------------------------------------------
// POST /api/progress
// Submits a new daily progress log
// ---------------------------------------------------------------------------
export async function postProgressData(
  payload: Partial<ProgressDashboardData>
): Promise<ProgressDashboardData> {
  return apiFetch<ProgressDashboardData>('/progress', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ---------------------------------------------------------------------------
// PUT /api/progress/:userId
// Updates an existing progress record
// ---------------------------------------------------------------------------
export async function putProgressData(
  userId: string,
  payload: Partial<ProgressDashboardData>
): Promise<ProgressDashboardData> {
  return apiFetch<ProgressDashboardData>(`/progress/${encodeURIComponent(userId)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

// ---------------------------------------------------------------------------
// DELETE /api/progress/:userId
// Deletes a user's progress record
// ---------------------------------------------------------------------------
export async function deleteProgressData(userId: string): Promise<void> {
  await apiFetch<void>(`/progress/${encodeURIComponent(userId)}`, {
    method: 'DELETE',
  });
}
