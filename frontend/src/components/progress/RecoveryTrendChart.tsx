'use client';
// =============================================================================
// RecoveryTrendChart — Line chart for recovery score trend (green line)
// =============================================================================

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  type TooltipProps,
} from 'recharts';
import type { RecoveryTrendPoint } from '@/types/progress';

interface RecoveryTrendChartProps {
  data: RecoveryTrendPoint[];
  status: string;
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
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
      <div style={{ color: 'var(--text2)', marginBottom: 2 }}>{label}</div>
      <div style={{ color: 'var(--green)', fontWeight: 800 }}>
        {payload[0].value}
      </div>
    </div>
  );
};

export const RecoveryTrendChart: React.FC<RecoveryTrendChartProps> = ({
  data,
  status,
}) => {
  const firstDate = data[0]?.date ?? '';
  const midDate   = data[Math.floor(data.length / 2)]?.date ?? '';
  const lastDate  = data[data.length - 1]?.date ?? '';

  return (
    <div
      className="p-4"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        height: '100%',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <h3
          style={{
            fontSize: 'var(--fs-card)',
            fontWeight: 800,
            color: 'var(--text)',
          }}
        >
          Recovery Trend
        </h3>
        <span
          style={{
            fontSize: 'var(--fs-caption)',
            fontWeight: 700,
            color: 'var(--green)',
          }}
        >
          + {status}
        </span>
      </div>

      {/* Chart */}
      <div style={{ height: 80 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -30 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,214,10,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 9, fill: 'var(--text2)', fontFamily: 'Manrope' }}
              axisLine={false}
              tickLine={false}
              ticks={[firstDate, midDate, lastDate]}
            />
            <YAxis hide domain={[50, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#A3E635"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 4,
                fill: '#A3E635',
                stroke: 'var(--card)',
                strokeWidth: 2,
              }}
              animationDuration={1000}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
