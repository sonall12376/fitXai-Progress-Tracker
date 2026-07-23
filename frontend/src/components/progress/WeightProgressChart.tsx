'use client';
// =============================================================================
// WeightProgressChart — Responsive Line Chart with custom tooltip
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
import { TrendIndicator } from './TrendIndicator';
import type { WeightDataPoint } from '@/types/progress';

interface WeightProgressChartProps {
  data: WeightDataPoint[];
  currentWeight: number;
  weightChange: number;
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
      <div style={{ color: 'var(--purple)', fontWeight: 800 }}>
        {payload[0].value} kg
      </div>
    </div>
  );
};

export const WeightProgressChart: React.FC<WeightProgressChartProps> = ({
  data,
  currentWeight,
  weightChange,
}) => {
  const firstDate = data[0]?.date ?? '';
  const midDate   = data[Math.floor(data.length / 2)]?.date ?? '';
  const lastDate  = data[data.length - 1]?.date ?? '';

  return (
    <div
      className="p-4 animate-fade-up stagger-2"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        height: '100%',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3
            style={{
              fontSize: 'var(--fs-card)',
              fontWeight: 800,
              color: 'var(--text)',
            }}
          >
            Weight Progress
          </h3>
          <TrendIndicator value={weightChange} unit=" kg" positiveIsGood={false} />
        </div>
      </div>

      {/* Current weight */}
      <div
        className="mb-3"
        style={{ fontSize: 'var(--fs-metric)', fontWeight: 800, color: 'var(--text)' }}
      >
        {currentWeight}{' '}
        <span style={{ fontSize: 'var(--fs-caption)', color: 'var(--text2)', fontWeight: 500 }}>
          kg
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
            <YAxis hide domain={['dataMin - 0.5', 'dataMax + 0.5']} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#F5C400"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 4,
                fill: '#F5C400',
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
