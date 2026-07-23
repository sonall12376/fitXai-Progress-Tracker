'use client';
// =============================================================================
// CaloriesBarChart — Bar Chart for daily calories burned
// FIX: Removed negative left margin that was clipping the first 2 bars.
//      Use width="99%" on ResponsiveContainer to avoid a known Recharts
//      resize-observer loop, and set proper margins so all 7 bars are visible.
// =============================================================================

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  type TooltipProps,
} from 'recharts';
import type { CalorieDataPoint } from '@/types/progress';

interface CaloriesBarChartProps {
  data: CalorieDataPoint[];
  avgCalories: number;
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
        {payload[0].value} kcal
      </div>
    </div>
  );
};

const ACTIVE_COLOR = '#F5C400'; // target met or exceeded
const MUTED_COLOR  = '#CA8A04'; // below target but non-zero
const ZERO_COLOR   = 'rgba(255,214,10,0.18)'; // rest day

export const CaloriesBarChart: React.FC<CaloriesBarChartProps> = ({
  data,
  avgCalories,
}) => {
  return (
    <div
      className="p-4 animate-fade-up stagger-5"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        height: '100%',
      }}
    >
      {/* Header */}
      <h3
        style={{
          fontSize: 'var(--fs-card)',
          fontWeight: 800,
          color: 'var(--text)',
          marginBottom: 2,
        }}
      >
        Calories Burned
      </h3>
      <p
        style={{
          fontSize: 'var(--fs-caption)',
          color: 'var(--text2)',
          marginBottom: 10,
        }}
      >
        Avg {avgCalories} kcal
      </p>

      {/* Chart
          FIX: margin left was -30 which pushed the first 2 bars off-canvas.
               Set left: 0 so all bars are fully visible.
               width="99%" avoids a Recharts ResizeObserver infinite-loop bug.   */}
      <div style={{ height: 100 }}>
        <ResponsiveContainer width="99%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
            barCategoryGap="20%"
            barSize={12}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,214,10,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 9, fill: 'var(--text2)', fontFamily: 'Manrope' }}
              axisLine={false}
              tickLine={false}
              /* Give the axis a tiny amount of padding so first/last
                 labels are never clipped */
              padding={{ left: 4, right: 4 }}
            />
            {/* Hidden Y axis — still needed for domain scaling */}
            <YAxis
              hide
              domain={[0, (dataMax: number) => Math.max(dataMax * 1.15, 500)]}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(245,196,0,0.06)' }}
            />
            <Bar
              dataKey="calories"
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`bar-${index}`}
                  fill={
                    entry.calories === 0
                      ? ZERO_COLOR
                      : entry.calories >= entry.target
                      ? ACTIVE_COLOR
                      : MUTED_COLOR
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
