import React from 'react';

interface ReagentGaugeProps {
  moringaPercent?: number;
  citricAcidPercent?: number;
  biocharStatus?: 'optimal' | 'degraded' | 'replace';
}

export function ReagentGauge({ moringaPercent = 0, citricAcidPercent = 0, biocharStatus = 'optimal' }: ReagentGaugeProps) {
  const getBiocharColor = () => {
    switch(biocharStatus) {
      case 'optimal': return 'bg-emerald-500';
      case 'degraded': return 'bg-amber-500';
      case 'replace': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/50 flex flex-col w-full">
      <h3 className="text-white font-semibold text-lg mb-4 mt-0">Consumables</h3>
      
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span className="text-slate-300 text-sm">Moringa-Chitosan</span>
          <span className="text-cyan-400 text-sm font-medium">{moringaPercent}%</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className={`h-full ${moringaPercent < 20 ? 'bg-red-500' : 'bg-cyan-500'}`} 
            style={{ width: `${moringaPercent}%` }} 
          />
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-slate-300 text-sm">Citric Acid</span>
          <span className="text-amber-400 text-sm font-medium">{citricAcidPercent}%</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className={`h-full ${citricAcidPercent < 15 ? 'bg-red-500' : 'bg-amber-500'}`} 
            style={{ width: `${citricAcidPercent}%` }} 
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-700 pt-3">
        <span className="text-slate-300 text-sm">Biochar Filter</span>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${getBiocharColor()}`} />
          <span className="text-white text-sm capitalize">{biocharStatus}</span>
        </div>
      </div>
    </div>
  );
}
