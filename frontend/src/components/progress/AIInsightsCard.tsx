'use client';
// =============================================================================
// AIInsightsCard — AI coaching message panel with sparkle icon
// =============================================================================

import React from 'react';
import { Sparkles } from 'lucide-react';
import type { ProgressDashboardData } from '@/types/progress';

interface AIInsightsCardProps {
  data: Pick<
    ProgressDashboardData,
    | 'motivationMessage'
    | 'improvementAnalysis'
    | 'personalizedRecommendations'
  >;
}

export const AIInsightsCard: React.FC<AIInsightsCardProps> = ({ data }) => {
  const topRec = data.personalizedRecommendations[0];

  return (
    <div
      className="mx-5 mb-5 p-4"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #F5C400, #FDE68A)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Sparkles size={14} color="#000" strokeWidth={2.5} />
        </div>
        <h3
          style={{
            fontSize: 'var(--fs-title)',
            fontWeight: 800,
            color: 'var(--text)',
          }}
        >
          AI Insights
        </h3>
      </div>

      {/* Motivation message */}
      <p
        style={{
          fontSize: 'var(--fs-body)',
          color: 'var(--text2)',
          lineHeight: 1.65,
          marginBottom: 12,
        }}
      >
        {data.motivationMessage}
      </p>

      {/* Improvement highlight */}
      {data.improvementAnalysis.isImproving && (
        <div
          style={{
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(163,230,53,0.08)',
            border: '1px solid rgba(163,230,53,0.2)',
            fontSize: 'var(--fs-caption)',
            color: 'var(--green)',
            fontWeight: 600,
            marginBottom: 10,
          }}
        >
          ↑ {data.improvementAnalysis.metricChanges[0]}
        </div>
      )}

      {/* Top recommendation */}
      {topRec && (
        <div
          style={{
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(245,196,0,0.06)',
            border: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              fontSize: 'var(--fs-overline)',
              fontWeight: 700,
              color: 'var(--purple)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: 2,
            }}
          >
            {topRec.category} · {topRec.priority} Priority
          </div>
          <p
            style={{
              fontSize: 'var(--fs-caption)',
              color: 'var(--text)',
              fontWeight: 500,
            }}
          >
            {topRec.action}
          </p>
        </div>
      )}
    </div>
  );
};
