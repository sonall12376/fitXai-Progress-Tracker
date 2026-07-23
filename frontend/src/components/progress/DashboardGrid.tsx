'use client';
// =============================================================================
// DashboardGrid — Main responsive grid assembling all dashboard sections
// Uses dynamic imports for chart components (Client Components)
// =============================================================================

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { TimeRange, ProgressDashboardData } from '@/types/progress';

import { DashboardHeader } from './DashboardHeader';
import { TimeRangeToggle } from './TimeRangeToggle';
import { FitnessScoreCard } from './FitnessScoreCard';
import { AchievementsSection } from './AchievementsSection';
import { AIInsightsCard } from './AIInsightsCard';
import { ProgressSummary } from './ProgressSummary';
import { BottomNav } from './BottomNav';
import { useDataRouting } from '@/hooks/useDataRouting';

// Lazy-load chart components
const WeightProgressChart = dynamic(
  () => import('./WeightProgressChart').then((m) => ({ default: m.WeightProgressChart })),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const StrengthRadarChart = dynamic(
  () => import('./StrengthRadarChart').then((m) => ({ default: m.StrengthRadarChart })),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const WorkoutCompletionChart = dynamic(
  () => import('./WorkoutCompletionChart').then((m) => ({ default: m.WorkoutCompletionChart })),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const CaloriesBarChart = dynamic(
  () => import('./CaloriesBarChart').then((m) => ({ default: m.CaloriesBarChart })),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const RecoveryTrendChart = dynamic(
  () => import('./RecoveryTrendChart').then((m) => ({ default: m.RecoveryTrendChart })),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const NutritionComplianceChart = dynamic(
  () =>
    import('./NutritionComplianceChart').then((m) => ({
      default: m.NutritionComplianceChart,
    })),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

// ---------------------------------------------------------------------------
// Skeleton loader for chart cards
// ---------------------------------------------------------------------------
function ChartSkeleton() {
  return (
    <div
      className="p-4"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        height: '100%',
        minHeight: 160,
      }}
    >
      <div
        style={{
          height: 14,
          width: '60%',
          borderRadius: 6,
          background: 'var(--card2)',
          marginBottom: 12,
        }}
      />
      <div
        style={{
          height: 100,
          borderRadius: 8,
          background: 'rgba(255,255,255,0.03)',
          animation: 'pulse 2s infinite',
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Offline / Error banner
// ---------------------------------------------------------------------------
function OfflineBanner({ message }: { message: string }) {
  return (
    <div
      className="mx-5 mb-3 px-4 py-2"
      style={{
        background: 'rgba(245,196,0,0.08)',
        border: '1px solid rgba(245,196,0,0.2)',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--fs-caption)',
        color: 'var(--purple)',
        fontWeight: 600,
      }}
    >
      ⚡ {message}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Compute completion percentage from completion data
// ---------------------------------------------------------------------------
function computeCompletionPct(data: ProgressDashboardData): number {
  const total = data.completionData.reduce((sum, d) => sum + d.value, 0);
  const completed = data.completionData.find((d) => d.name === 'Completed')?.value ?? 0;
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

// ---------------------------------------------------------------------------
// Main Dashboard Grid
// ---------------------------------------------------------------------------
export const DashboardGrid: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('1Y');
  const [activeTab, setActiveTab] = useState('analytics');

  const { data, isLoading, isError, errorMessage, isOnline, isUsingCache } =
    useDataRouting('USR001', timeRange, true /* useMockData */);

  const completionPct = useMemo(
    () => (data ? computeCompletionPct(data) : 76),
    [data]
  );

  // -----------------------------------------------------------------------
  // Loading state
  // -----------------------------------------------------------------------
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100dvh',
          background: 'var(--bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              border: '3px solid rgba(245,196,0,0.15)',
              borderTopColor: '#F5C400',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <span style={{ color: 'var(--text2)', fontSize: 'var(--fs-caption)' }}>
            Loading your progress...
          </span>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Error state (no data at all)
  // -----------------------------------------------------------------------
  if (isError && !data) {
    return (
      <div
        style={{
          minHeight: '100dvh',
          background: 'var(--bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <div
          className="text-center p-6"
          style={{
            background: 'var(--card)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border)',
            maxWidth: 320,
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontSize: 'var(--fs-title)', fontWeight: 800, marginBottom: 8 }}>
            Data Unavailable
          </h2>
          <p style={{ fontSize: 'var(--fs-caption)', color: 'var(--text2)' }}>
            {errorMessage ?? 'Unable to load progress data.'}
          </p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div
      style={{
        maxWidth: 480,
        margin: '0 auto',
        minHeight: '100dvh',
        background: 'var(--bg)',
        paddingBottom: 100,
      }}
    >
      {/* ----------------------------------------------------------------- */}
      {/* HEADER                                                             */}
      {/* ----------------------------------------------------------------- */}
      <DashboardHeader />

      {/* ----------------------------------------------------------------- */}
      {/* OFFLINE / CACHE NOTICE                                            */}
      {/* ----------------------------------------------------------------- */}
      {!isOnline && (
        <OfflineBanner message="You are offline — showing cached data" />
      )}
      {isUsingCache && isOnline && errorMessage && (
        <OfflineBanner message={errorMessage} />
      )}

      {/* ----------------------------------------------------------------- */}
      {/* TIME RANGE TOGGLE                                                  */}
      {/* ----------------------------------------------------------------- */}
      <TimeRangeToggle value={timeRange} onChange={setTimeRange} />

      {/* ----------------------------------------------------------------- */}
      {/* FITNESS SCORE HERO CARD                                           */}
      {/* ----------------------------------------------------------------- */}
      <FitnessScoreCard
        data={{
          progressScore: data.progressScore,
          streakDays: data.streakDays,
          completedWorkouts: data.completedWorkouts,
          targetWorkouts: data.targetWorkouts,
          improvementAnalysis: data.improvementAnalysis,
          goalProgress: data.goalProgress,
        }}
      />

      {/* ----------------------------------------------------------------- */}
      {/* WEIGHT + STRENGTH GRID (2 cols)                                   */}
      {/* ----------------------------------------------------------------- */}
      <div
        className="px-5 mb-3"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
        }}
      >
        <WeightProgressChart
          data={data.weightHistory}
          currentWeight={data.userProfile.weight}
          weightChange={data.weightChange}
        />
        <StrengthRadarChart
          data={data.strengthMetrics}
          strengthChangePercent={data.strengthChangePercent}
        />
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* WORKOUT COMPLETION + CALORIES GRID (2 cols)                       */}
      {/* ----------------------------------------------------------------- */}
      <div
        className="px-5 mb-3"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
        }}
      >
        <WorkoutCompletionChart
          data={data.completionData}
          completionPercentage={completionPct}
        />
        <CaloriesBarChart
          data={data.calorieHistory}
          avgCalories={data.avgCaloriesBurned}
        />
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* RECOVERY TREND + NUTRITION GRID (2 cols)                          */}
      {/* ----------------------------------------------------------------- */}
      <div
        className="px-5 mb-3"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
        }}
      >
        <RecoveryTrendChart
          data={data.recoveryTrend}
          status={data.recoveryAnalysis.status}
        />
        <NutritionComplianceChart data={data.nutritionCompliance} />
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* PROGRESS SUMMARY                                                   */}
      {/* ----------------------------------------------------------------- */}
      <ProgressSummary
        recoveryAnalysis={data.recoveryAnalysis}
        injuryRisk={data.injuryRisk}
        goalProgress={data.goalProgress}
        improvementAnalysis={data.improvementAnalysis}
        userVulnerabilities={data.userVulnerabilities}
      />

      {/* ----------------------------------------------------------------- */}
      {/* ACHIEVEMENTS                                                       */}
      {/* ----------------------------------------------------------------- */}
      <AchievementsSection achievements={data.achievements} />

      {/* ----------------------------------------------------------------- */}
      {/* AI INSIGHTS                                                        */}
      {/* ----------------------------------------------------------------- */}
      <AIInsightsCard
        data={{
          motivationMessage: data.motivationMessage,
          improvementAnalysis: data.improvementAnalysis,
          personalizedRecommendations: data.personalizedRecommendations,
        }}
      />

      {/* ----------------------------------------------------------------- */}
      {/* BOTTOM NAVIGATION                                                  */}
      {/* ----------------------------------------------------------------- */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Spinning loader keyframe */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};
