'use client';
// =============================================================================
// DashboardHeader — Page header with back nav and calendar icon
// =============================================================================

import React from 'react';
import { ArrowLeft, CalendarDays } from 'lucide-react';

interface DashboardHeaderProps {
  title?: string;
  onBack?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title = 'Progress & Analytics',
  onBack,
}) => {
  return (
    <header className="flex items-center justify-between px-5 pt-4 pb-2">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="Go back"
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
          style={{ background: 'var(--card2)', border: '1px solid var(--border)' }}
        >
          <ArrowLeft size={18} color="var(--text)" strokeWidth={2} />
        </button>
        <h1
          className="text-hero"
          style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}
        >
          {title}
        </h1>
      </div>

      <button
        aria-label="Open calendar"
        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
        style={{ background: 'var(--card2)', border: '1px solid var(--border)' }}
      >
        <CalendarDays size={18} color="var(--text2)" strokeWidth={2} />
      </button>
    </header>
  );
};
