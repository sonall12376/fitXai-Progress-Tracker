'use client';
// =============================================================================
// FitnessScoreRing — Animated SVG progress ring
// =============================================================================

import React, { useEffect, useState } from 'react';

interface FitnessScoreRingProps {
  score: number; // 0–100
  size?: number;
  strokeWidth?: number;
}

export const FitnessScoreRing: React.FC<FitnessScoreRingProps> = ({
  score,
  size = 120,
  strokeWidth = 10,
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    // Animate ring fill on mount
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div
      role="img"
      aria-label={`Fitness score: ${score} out of 100`}
      style={{ position: 'relative', width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)', display: 'block' }}
      >
        <defs>
          <linearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F5C400" />
            <stop offset="100%" stopColor="#FDE68A" />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(245,196,0,0.12)"
          strokeWidth={strokeWidth}
        />

        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>

      {/* Center label */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <span
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: 'var(--text)',
            lineHeight: 1,
          }}
        >
          {score}
        </span>
      </div>
    </div>
  );
};
