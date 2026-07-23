'use client';
// =============================================================================
// StrengthRadarChart — Radar Chart for muscle group strength metrics
// =============================================================================

import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  Tooltip,
  type TooltipProps,
} from 'recharts';
import type { StrengthMetric } from '@/types/progress';

interface StrengthRadarChartProps {
  data: StrengthMetric[];
  strengthChangePercent: number;
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '8px 12px',
        fontSize: 'var(--fs-caption)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div style={{ color: 'var(--text2)', marginBottom: 2 }}>{payload[0].name}</div>
      <div style={{ color: 'var(--purple)', fontWeight: 800 }}>
        {payload[0].value}%
      </div>
    </div>
  );
};

export const StrengthRadarChart: React.FC<StrengthRadarChartProps> = ({
  data,
  strengthChangePercent,
}) => {
  return (
    <div
      className="p-4 animate-fade-up stagger-3"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        height: '100%',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h3
          style={{
            fontSize: 'var(--fs-card)',
            fontWeight: 800,
            color: 'var(--text)',
          }}
        >
          Strength Progress
        </h3>
        <span
          style={{
            fontSize: 'var(--fs-caption)',
            fontWeight: 700,
            color: 'var(--green)',
          }}
        >
          +{strengthChangePercent}%
        </span>
      </div>

      {/* Chart */}
      <div style={{ height: 160, marginTop: 8 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} margin={{ top: 4, right: 12, bottom: 4, left: 12 }}>
            <PolarGrid
              stroke="rgba(255,214,10,0.12)"
              gridType="polygon"
            />
            <PolarAngleAxis
              dataKey="subject"
              tick={{
                fontSize: 9,
                fill: 'var(--text2)',
                fontFamily: 'Manrope',
                fontWeight: 600,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Radar
              name="Strength"
              dataKey="value"
              stroke="#F5C400"
              fill="#CA8A04"
              fillOpacity={0.55}
              strokeWidth={2}
              animationDuration={1000}
              animationEasing="ease-out"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
