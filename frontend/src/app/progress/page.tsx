// =============================================================================
// Progress & Analytics Dashboard — Page (Server Component)
// =============================================================================

import type { Metadata } from 'next';
import { DashboardGrid } from '@/components/progress/DashboardGrid';

export const metadata: Metadata = {
  title: 'Progress & Analytics — FitAI-X',
  description:
    'Track your fitness progress, workout consistency, weight changes, and AI-powered insights in the FitAI-X dashboard.',
  keywords: ['fitness', 'progress', 'analytics', 'workout', 'health tracking'],
};

// This page is a Server Component — DashboardGrid is the Client boundary
export default function ProgressPage() {
  return (
    <main
      aria-label="Progress and Analytics Dashboard"
      style={{ minHeight: '100dvh', background: 'var(--bg)' }}
    >
      <DashboardGrid />
    </main>
  );
}
