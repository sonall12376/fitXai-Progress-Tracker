'use client';
// =============================================================================
// WorkoutCompletionChart — Donut/Pie Chart with legend
// =============================================================================

import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  type TooltipProps,
} from 'recharts';
import type { CompletionDataPoint } from '@/types/progress';

interface WorkoutCompletionChartProps {
  data: CompletionDataPoint[];
  completionPercentage: number;
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
      <div style={{ color: payload[0].payload.color, fontWeight: 800 }}>
        {payload[0].name}: {payload[0].value}
      </div>
    </div>
  );
};

export const WorkoutCompletionChart: React.FC<WorkoutCompletionChartProps> = ({
  data,
  completionPercentage,
}) => {
  return (
    <div
      className="p-4 animate-fade-up stagger-4"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        height: '100%',
      }}
    >
      <h3
        style={{
          fontSize: 'var(--fs-card)',
          fontWeight: 800,
          color: 'var(--text)',
          marginBottom: 12,
        }}
      >
        Workout Completion
      </h3>

      {/* Donut + center label */}
      <div className="flex items-center gap-4">
        <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={56}
                paddingAngle={3}
                dataKey="value"
                animationDuration={1000}
                animationEasing="ease-out"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center percentage */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: 'var(--text)',
              }}
            >
              {completionPercentage}%
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: entry.color,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 'var(--fs-caption)',
                    color: 'var(--text2)',
                  }}
                >
                  {entry.name}
                </span>
              </div>
              <span
                style={{
                  fontSize: 'var(--fs-caption)',
                  fontWeight: 700,
                  color: 'var(--text)',
                  minWidth: 16,
                  textAlign: 'right',
                }}
              >
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
