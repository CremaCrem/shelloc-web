import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface BuoyancyAlertProps {
  isVisible: boolean;
}

export function BuoyancyAlert({ isVisible }: BuoyancyAlertProps) {
  if (!isVisible) return null;

  return (
    <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 flex items-center mb-4">
      <AlertTriangle color="#ef4444" size={24} />
      <div className="ml-3 flex-1">
        <h4 className="text-red-400 font-bold text-base m-0">Buoyancy Failsafe Active</h4>
        <p className="text-red-300/80 text-sm m-0 mt-1">Ballast pump evacuating to raise antenna for GPS lock.</p>
      </div>
    </div>
  );
}
