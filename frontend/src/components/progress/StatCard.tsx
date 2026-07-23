'use client';
// =============================================================================
// StatCard — General-purpose stat display card (can be used anywhere in grid)
// =============================================================================

import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  trend?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  iconBg = 'rgba(245,196,0,0.12)',
  iconColor = 'var(--purple)',
  trend,
  children,
  className = '',
  style,
}) => {
  return (
    <div
      className={`p-4 ${className}`}
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        ...style,
      }}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between mb-3">
        <span
          style={{
            fontSize: 'var(--fs-caption)',
            fontWeight: 'var(--fw-semibold)',
            color: 'var(--text2)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {title}
        </span>
        {Icon && (
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={14} color={iconColor} strokeWidth={2} />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1 mb-1">
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
          <span style={{ fontSize: 'var(--fs-caption)', color: 'var(--text2)' }}>
            {unit}
          </span>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p
          style={{
            fontSize: 'var(--fs-caption)',
            color: 'var(--text2)',
            marginBottom: trend || children ? 8 : 0,
          }}
        >
          {subtitle}
        </p>
      )}

      {/* Trend */}
      {trend && <div className="mb-2">{trend}</div>}

      {/* Optional children slot (e.g. progress bar) */}
      {children}
    </div>
  );
};
