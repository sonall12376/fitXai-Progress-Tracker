'use client';
// =============================================================================
// FitnessScoreCard — Hero card: score ring, streak, workout count, mood
// =============================================================================

import React from 'react';
import { FitnessScoreRing } from './FitnessScoreRing';
import { TrendingUp, Droplets, Flame } from 'lucide-react';
import type { ProgressDashboardData } from '@/types/progress';

interface FitnessScoreCardProps {
  data: Pick<
    ProgressDashboardData,
    | 'progressScore'
    | 'streakDays'
    | 'completedWorkouts'
    | 'targetWorkouts'
    | 'improvementAnalysis'
    | 'goalProgress'
  >;
}

function getScoreLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'Exceptional!', color: 'var(--green)' };
  if (score >= 75) return { label: 'Great Progress!', color: 'var(--green)' };
  if (score >= 60) return { label: 'On Track!', color: 'var(--purple)' };
  if (score >= 45) return { label: 'Needs Attention', color: 'var(--amber)' };
  return { label: 'Below Target', color: 'var(--red)' };
}

export const FitnessScoreCard: React.FC<FitnessScoreCardProps> = ({ data }) => {
  const { label, color } = getScoreLabel(data.progressScore);

  return (
    <div
      className="mx-5 mb-3 p-5 animate-fade-up stagger-1"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left: score number and label */}
        <div className="flex flex-col gap-1">
          <span
            style={{
              fontSize: 'var(--fs-caption)',
              fontWeight: 'var(--fw-semibold)',
              color: 'var(--text2)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Fitness Score
          </span>

          <div className="flex items-baseline gap-1">
            <span
              style={{
                fontSize: 40,
                fontWeight: 800,
                color: 'var(--text)',
                lineHeight: 1,
              }}
            >
              {data.progressScore}
            </span>
            <span
              style={{
                fontSize: 'var(--fs-card)',
                fontWeight: 600,
                color: 'var(--text2)',
              }}
            >
              /100
            </span>
          </div>

          <div className="flex items-center gap-1 mt-1">
            <Flame size={14} color={color} />
            <span style={{ fontSize: 'var(--fs-card)', fontWeight: 700, color }}>
              {label}
            </span>
          </div>
        </div>

        {/* Center: ring */}
        <FitnessScoreRing score={data.progressScore} size={110} strokeWidth={9} />

        {/* Right: streak and workout count */}
        <div className="flex flex-col gap-3 text-right">
          <div>
            <div className="flex items-center justify-end gap-1">
              <Droplets size={13} color="var(--purple)" />
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: 'var(--text)',
                  lineHeight: 1,
                }}
              >
                {data.streakDays}
              </span>
            </div>
            <div
              style={{
                fontSize: 'var(--fs-caption)',
                color: 'var(--text2)',
              }}
            >
              Days{' '}
              <span style={{ color: 'var(--purple)', fontWeight: 700 }}>
                Streak
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-end gap-1">
              <TrendingUp size={13} color="var(--green)" />
              <span
                style={{
                  fontSize: 'var(--fs-metric)',
                  fontWeight: 800,
                  color: 'var(--text)',
                }}
              >
                {data.completedWorkouts}/{data.targetWorkouts}
              </span>
            </div>
            <div
              style={{
                fontSize: 'var(--fs-caption)',
                color: 'var(--text2)',
              }}
            >
              Workouts
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
