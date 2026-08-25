import React, { useEffect, useState } from 'react';

interface ProgressRingProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 12,
  color = '#4F91D6', // sky
  backgroundColor = '#F4F4F5', // surfaceMuted
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const clampedProgress = Math.max(0, Math.min(1, progress));
    setOffset(circumference - clampedProgress * circumference);
  }, [progress, circumference]);

  return (
    <div
      style={{ width: size, height: size }}
      className="flex items-center justify-center -rotate-90 transform"
    >
      <svg width={size} height={size}>
        {/* Background Track */}
        <circle
          stroke={backgroundColor}
          fill="transparent"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Animated Progress */}
        <circle
          stroke={color}
          fill="transparent"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
    </div>
  );
}
