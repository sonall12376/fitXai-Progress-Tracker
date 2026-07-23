'use client';
// =============================================================================
// MetricCard — Small stat tile used in grid
// =============================================================================

import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  iconColor?: string;
  trend?: React.ReactNode;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  icon: Icon,
  iconColor = 'var(--purple)',
  trend,
  className = '',
}) => {
  return (
    <div
      className={`p-4 ${className}`}
      style={{
        background: 'var(--card2)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          style={{
            fontSize: 'var(--fs-caption)',
            fontWeight: 'var(--fw-semibold)',
            color: 'var(--text2)',
          }}
        >
          {label}
        </span>
        {Icon && <Icon size={14} color={iconColor} strokeWidth={2} />}
      </div>

      <div className="flex items-end gap-1">
        <span
          style={{
            fontSize: 'var(--fs-metric)',
            fontWeight: 800,
            color: 'var(--text)',
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        {unit && (
          <span
            style={{
              fontSize: 'var(--fs-caption)',
              color: 'var(--text2)',
              marginBottom: 1,
            }}
          >
            {unit}
          </span>
        )}
      </div>

      {trend && <div className="mt-1">{trend}</div>}
    </div>
  );
};
