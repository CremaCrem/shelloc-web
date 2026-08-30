import React from 'react';
import { Droplet } from 'lucide-react';

interface AdaptiveBadgeProps {
  reagentType?: 'flocculant' | 'citric_acid' | null;
  isVisible?: boolean;
}

export function AdaptiveRemediationBadge({ reagentType, isVisible }: AdaptiveBadgeProps) {
  if (!isVisible || !reagentType) return null;

  const isCitric = reagentType === 'citric_acid';
  const colorClass = isCitric ? 'text-amber-400' : 'text-cyan-400';
  const bgClass = isCitric ? 'bg-amber-900/30 border-amber-500/30' : 'bg-cyan-900/30 border-cyan-500/30';
  const label = isCitric ? '+ Citric Acid Dose' : '+ Flocculant Dose';

  return (
    <div className={`flex items-center border rounded-full px-2 py-1 self-start ${bgClass}`}>
      <Droplet size={12} color={isCitric ? '#fbbf24' : '#22d3ee'} />
      <span className={`ml-1 text-xs font-medium ${colorClass}`}>{label}</span>
    </div>
  );
}
