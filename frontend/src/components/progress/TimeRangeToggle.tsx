'use client';
// =============================================================================
// TimeRangeToggle — 7D / 30D / 90D / 1Y pill selector
// =============================================================================

import React from 'react';
import type { TimeRange } from '@/types/progress';

interface TimeRangeToggleProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

const RANGES: TimeRange[] = ['7D', '30D', '90D', '1Y'];

export const TimeRangeToggle: React.FC<TimeRangeToggleProps> = ({ value, onChange }) => {
  return (
    <div
      role="radiogroup"
      aria-label="Select time range"
      className="flex items-center gap-1 p-1.5 mx-5 my-3"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      {RANGES.map((range) => {
        const isActive = value === range;
        return (
          <button
            key={range}
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(range)}
            className="flex-1 text-center transition-all"
            style={{
              padding: '8px 0',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--fs-card)',
              fontWeight: isActive ? 'var(--fw-bold)' : 'var(--fw-semibold)',
              color: isActive ? '#000' : 'var(--text2)',
              background: isActive
                ? 'linear-gradient(135deg, #F5C400, #FFB300)'
                : 'transparent',
              border: 'none',
              cursor: 'pointer',
              boxShadow: isActive ? 'var(--shadow-gold)' : 'none',
              transition: 'all 200ms ease',
            }}
          >
            {range}
          </button>
        );
      })}
    </div>
  );
};
