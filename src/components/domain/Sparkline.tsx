import React from 'react';

interface SparklineProps {
  data: number[];
  color?: string;
  strokeWidth?: number;
}

export function Sparkline({ data, color = '#4F91D6', strokeWidth = 2 }: SparklineProps) {
  if (!data || data.length < 2) return <div className="flex-1 w-full h-full" />;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min; // avoid division by zero

  // Map to a 100x100 viewBox
  const width = 100;
  const height = 100;

  const pathParts = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    
    // add some padding for the stroke so it doesn't clip
    const padding = strokeWidth * 2;
    const paddedHeight = height - padding * 2;
    const adjustedY = padding + (height - ((value - min) / range) * height) * (paddedHeight / height);

    return `${index === 0 ? 'M' : 'L'} ${x},${adjustedY}`;
  });

  const d = pathParts.join(' ');

  return (
    <div className="flex-1 w-full h-full">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
