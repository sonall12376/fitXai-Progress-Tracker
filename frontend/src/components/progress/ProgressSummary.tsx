'use client';
// =============================================================================
// ProgressSummary — Recovery/vulnerability/goal summary section
// =============================================================================

import React from 'react';
import { ShieldAlert, Target, Zap } from 'lucide-react';
import type {
  RecoveryAnalysis,
  InjuryRisk,
  GoalProgress,
  ImprovementAnalysis,
} from '@/types/progress';

interface ProgressSummaryProps {
  recoveryAnalysis: RecoveryAnalysis;
  injuryRisk: InjuryRisk;
  goalProgress: GoalProgress;
  improvementAnalysis: ImprovementAnalysis;
  userVulnerabilities: string[];
}

function statusColor(status: string): string {
  const map: Record<string, string> = {
    Optimal: 'var(--green)',
    Excellent: 'var(--green)',
    'On Track': 'var(--green)',
    'Ahead of Plan': 'var(--green)',
    Good: 'var(--green)',
    Adequate: 'var(--purple)',
    Fair: 'var(--purple)',
    'Sub-optimal': 'var(--amber)',
    Medium: 'var(--amber)',
    Moderate: 'var(--amber)',
    'Behind Plan': 'var(--amber)',
    Impaired: 'var(--red)',
    Poor: 'var(--red)',
    High: 'var(--red)',
    Critical: 'var(--red)',
    Stagnant: 'var(--red)',
  };
  return map[status] ?? 'var(--text2)';
}

export const ProgressSummary: React.FC<ProgressSummaryProps> = ({
  recoveryAnalysis,
  injuryRisk,
  goalProgress,
  improvementAnalysis,
  userVulnerabilities,
}) => {
  return (
    <section aria-label="Progress Summary" className="px-5 mb-3">
      <div
        className="p-4"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
        }}
      >
        <h2
          style={{
            fontSize: 'var(--fs-title)',
            fontWeight: 800,
            marginBottom: 16,
          }}
        >
          Summary
        </h2>

        {/* Recovery */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap size={14} color="var(--purple)" />
            <span style={{ fontSize: 'var(--fs-card)', color: 'var(--text2)' }}>
              Recovery
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              style={{
                fontSize: 'var(--fs-caption)',
                fontWeight: 700,
                color: statusColor(recoveryAnalysis.status),
              }}
            >
              {recoveryAnalysis.status}
            </span>
            <span style={{ color: 'var(--text2)', fontSize: 'var(--fs-caption)' }}>
              · Sleep: {recoveryAnalysis.sleepQuality}
            </span>
          </div>
        </div>

        {/* Injury Risk */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert size={14} color="var(--amber)" />
            <span style={{ fontSize: 'var(--fs-card)', color: 'var(--text2)' }}>
              Injury Risk
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              style={{
                fontSize: 'var(--fs-caption)',
                fontWeight: 700,
                color: statusColor(injuryRisk.riskLevel),
              }}
            >
              {injuryRisk.riskLevel}
            </span>
            {injuryRisk.criticalAreas.length > 0 && (
              <span style={{ color: 'var(--text2)', fontSize: 'var(--fs-caption)' }}>
                · {injuryRisk.criticalAreas.join(', ')}
              </span>
            )}
          </div>
        </div>

        {/* Goal Progress */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target size={14} color="var(--green)" />
            <span style={{ fontSize: 'var(--fs-card)', color: 'var(--text2)' }}>
              Goal
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              style={{
                fontSize: 'var(--fs-caption)',
                fontWeight: 700,
                color: statusColor(goalProgress.status),
              }}
            >
              {goalProgress.status}
            </span>
            {goalProgress.estimatedWeeksToGoal != null && (
              <span style={{ color: 'var(--text2)', fontSize: 'var(--fs-caption)' }}>
                · ~{goalProgress.estimatedWeeksToGoal}w
              </span>
            )}
          </div>
        </div>

        {/* Vulnerabilities */}
        {userVulnerabilities.length > 0 && (
          <div
            style={{
              borderTop: '1px solid var(--border)',
              paddingTop: 12,
            }}
          >
            <p
              style={{
                fontSize: 'var(--fs-overline)',
                color: 'var(--text2)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: 6,
              }}
            >
              Bottlenecks
            </p>
            {userVulnerabilities.map((v, i) => (
              <div
                key={i}
                className="flex items-start gap-2 mb-1"
              >
                <span style={{ color: 'var(--amber)', fontSize: 11 }}>⚠</span>
                <span style={{ fontSize: 'var(--fs-caption)', color: 'var(--text2)' }}>
                  {v}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
