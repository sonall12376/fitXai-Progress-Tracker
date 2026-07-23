'use client';
// =============================================================================
// NutritionComplianceChart — Concentric rings + metric stats
// FIX: Use a single unified SVG so all rings share the same coordinate
//      system and stay perfectly centered on each other.
// =============================================================================

import React from 'react';
import type { NutritionCompliance } from '@/types/progress';

interface NutritionComplianceChartProps {
  data: NutritionCompliance;
}

const SVG_SIZE    = 118; // total canvas size (px)
const CX          = SVG_SIZE / 2; // 59
const CY          = SVG_SIZE / 2; // 59
const STROKE_W    = 8;
const RINGS = [
  { key: 'water',    radius: 50, color: '#A3E635' }, // outer
  { key: 'calories', radius: 37, color: '#F5C400' }, // middle
  { key: 'protein',  radius: 24, color: '#FFB300' }, // inner
] as const;

type RingKey = 'water' | 'calories' | 'protein';

export const NutritionComplianceChart: React.FC<NutritionComplianceChartProps> = ({
  data,
}) => {
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
      <h3
        style={{
          fontSize: 'var(--fs-card)',
          fontWeight: 800,
          color: 'var(--text)',
          marginBottom: 12,
        }}
      >
        Nutrition Compliance
      </h3>

      <div className="flex items-center gap-4">
        {/* ----------------------------------------------------------------
            Single SVG — all three rings share one coordinate system
            so they are automatically centered on the same origin.
        ---------------------------------------------------------------- */}
        <div style={{ flexShrink: 0, width: SVG_SIZE, height: SVG_SIZE }}>
          <svg
            width={SVG_SIZE}
            height={SVG_SIZE}
            viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
            style={{ transform: 'rotate(-90deg)', display: 'block' }}
          >
            {RINGS.map(({ key, radius, color }) => {
              const pct          = data[key as RingKey] as number;
              const circumference = 2 * Math.PI * radius;
              const offset        = circumference - (pct / 100) * circumference;
              return (
                <React.Fragment key={key}>
                  {/* Track */}
                  <circle
                    cx={CX}
                    cy={CY}
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.07)"
                    strokeWidth={STROKE_W}
                  />
                  {/* Progress arc */}
                  <circle
                    cx={CX}
                    cy={CY}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={STROKE_W}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                  />
                </React.Fragment>
              );
            })}
          </svg>
        </div>

        {/* Stats column */}
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          {[
            { label: 'Protein',  value: data.protein,  goal: data.proteinGoal,  color: '#FFB300' },
            { label: 'Calories', value: data.calories, goal: data.caloriesGoal, color: '#F5C400' },
            { label: 'Water',    value: data.water,    goal: data.waterGoal,    color: '#A3E635' },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex items-center gap-1.5">
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: item.color,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: item.color,
                    lineHeight: 1,
                  }}
                >
                  {item.value}%
                </span>
              </div>
              <p
                style={{
                  fontSize: 9.5,
                  color: 'var(--text2)',
                  fontWeight: 500,
                  marginTop: 2,
                  whiteSpace: 'nowrap',
                }}
              >
                {item.label} · Goal: {item.goal}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
