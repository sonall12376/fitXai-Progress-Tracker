'use client';
// =============================================================================
// AchievementsSection — Hexagonal achievement badges row
// =============================================================================

import React from 'react';
import type { Achievement } from '@/types/progress';

interface AchievementsSectionProps {
  achievements: Achievement[];
  onViewAll?: () => void;
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  achievements,
  onViewAll,
}) => {
  return (
    <section aria-label="Achievements" className="px-5 py-3">
      <div className="flex items-center justify-between mb-4">
        <h2
          style={{
            fontSize: 'var(--fs-hero)',
            fontWeight: 800,
            color: 'var(--text)',
          }}
        >
          Achievements
        </h2>
        <button
          onClick={onViewAll}
          style={{
            fontSize: 'var(--fs-caption)',
            fontWeight: 600,
            color: 'var(--purple)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          View All
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className="flex flex-col items-center gap-2 flex-shrink-0"
          >
            {/* Hexagon badge */}
            <div
              style={{
                width: 72,
                height: 72,
                clipPath:
                  'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)',
                background: `linear-gradient(135deg, ${achievement.color}, ${achievement.color}99)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              <span style={{ fontSize: 16 }}>{achievement.icon}</span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: '#000',
                  lineHeight: 1,
                }}
              >
                {achievement.value}
              </span>
            </div>

            <span
              style={{
                fontSize: 'var(--fs-caption)',
                fontWeight: 600,
                color: 'var(--text2)',
                textAlign: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              {achievement.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
