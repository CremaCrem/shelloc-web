import React from 'react';

interface CountdownTimerProps {
  timerRemainingSec?: number | null;
  isActive: boolean;
}

export function CountdownTimer({ timerRemainingSec, isActive }: CountdownTimerProps) {
  if (!isActive || timerRemainingSec == null) return null;
  
  const minutes = Math.floor(timerRemainingSec / 60);
  const seconds = timerRemainingSec % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  const progress = timerRemainingSec / 900;
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative flex items-center justify-center w-32 h-32">
        <svg width="120" height="120" viewBox="0 0 120 120" className="absolute -rotate-90">
          <circle
            cx="60" cy="60" r={radius}
            className="stroke-slate-800"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx="60" cy="60" r={radius}
            stroke="#00F2FE"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <span className="text-3xl font-bold text-white tabular-nums absolute">{timeString}</span>
        <span className="text-[10px] text-cyan-400 uppercase font-semibold tracking-wider absolute top-[75px]">Incubating</span>
      </div>
    </div>
  );
}
