'use client';
// =============================================================================
// TrendIndicator — Arrow with value showing positive/negative trend
// =============================================================================

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendIndicatorProps {
  value: number;
  unit?: string;
  positiveIsGood?: boolean; // e.g. false for weight (losing = good)
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  value,
  unit = '',
  positiveIsGood = true,
}) => {
  const isPositive = value > 0;
  const isNeutral = value === 0;

  // Determine semantic color based on direction and positiveIsGood
  let color: string;
  if (isNeutral) {
    color = 'var(--text2)';
  } else if (isPositive) {
    color = positiveIsGood ? 'var(--green)' : 'var(--red)';
  } else {
    color = positiveIsGood ? 'var(--red)' : 'var(--green)';
  }

  const Icon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;
  const displayValue = `${isPositive ? '+' : ''}${value}${unit}`;

  return (
    <span
      className="flex items-center gap-0.5"
      style={{ color, fontSize: 'var(--fs-caption)', fontWeight: 700 }}
    >
      <Icon size={12} strokeWidth={2.5} />
      {displayValue}
    </span>
  );
};
