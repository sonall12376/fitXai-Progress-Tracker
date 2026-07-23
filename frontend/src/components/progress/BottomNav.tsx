'use client';
// =============================================================================
// BottomNav — Fixed bottom navigation bar matching screenshot
// =============================================================================

import React from 'react';
import { Home, Dumbbell, Plus, BarChart2, User } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  isFab?: boolean;
}

interface BottomNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab = 'analytics',
  onTabChange,
}) => {
  const items: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home size={22} strokeWidth={1.8} />,
    },
    {
      id: 'workout',
      label: 'Workout',
      icon: <Dumbbell size={22} strokeWidth={1.8} />,
    },
    {
      id: 'add',
      label: '',
      icon: <Plus size={24} strokeWidth={2.5} />,
      isFab: true,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart2 size={22} strokeWidth={1.8} />,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User size={22} strokeWidth={1.8} />,
    },
  ];

  return (
    <nav
      aria-label="Main navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        zIndex: 50,
        background: 'rgba(16, 16, 16, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '10px 8px 28px',
      }}
    >
      {items.map((item) => {
        if (item.isFab) {
          return (
            <button
              key={item.id}
              aria-label="Add new entry"
              onClick={() => onTabChange?.(item.id)}
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #F5C400, #FFB300)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000',
                boxShadow: 'var(--shadow-gold)',
                transform: 'translateY(-8px)',
                transition: 'transform 200ms ease, box-shadow 200ms ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  'translateY(-10px) scale(1.05)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  'translateY(-8px)';
              }}
            >
              {item.icon}
            </button>
          );
        }

        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onTabChange?.(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 12px',
              borderRadius: 'var(--radius-md)',
              color: isActive ? 'var(--purple)' : 'var(--text2)',
              backgroundColor: isActive
                ? 'rgba(245,196,0,0.1)'
                : 'transparent',
              transition: 'all 200ms ease',
            }}
          >
            {item.icon}
            {item.label && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                {item.label}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
