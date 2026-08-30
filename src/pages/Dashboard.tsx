import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Info,
  Cpu,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Users,
  Activity,
  MapPin,
  Zap,
  Radio,
  ChevronRight,
} from 'lucide-react';

import { Typography } from '../components/core/Typography';
import { Card } from '../components/core/Card';
import { Badge } from '../components/core/Badge';
import { Button } from '../components/core/Button';
import { ProgressRing } from '../components/domain/ProgressRing';
import { CountdownTimer } from '../components/domain/CountdownTimer';
import { ReagentGauge } from '../components/domain/ReagentGauge';
import { useTelemetry } from '../hooks/useTelemetry';

export function Dashboard() {
  const navigate = useNavigate();
  const { statusData } = useTelemetry();
  const [operationMode, setOperationMode] = useState<'autonomous' | 'manual'>('autonomous');

  const battery = statusData?.battery_percent ?? statusData?.battery_level ?? 86;
  const pointsTreated = statusData?.points_treated_today ?? 4;
  const totalWaypoints = 6;
  const pointsProgress = pointsTreated / totalWaypoints;

  const toggleMode = () => {
    setOperationMode((prev) => (prev === 'autonomous' ? 'manual' : 'autonomous'));
  };

  return (
    <div className="p-6 md:p-8 w-full max-w-7xl mx-auto flex flex-col h-full overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* 1. About Card - Spans full width on mobile, 2 columns on tablet, 2 on desktop */}
        <Card className="p-6 md:col-span-2 lg:col-span-2 flex flex-col justify-center">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2.5 rounded-xl bg-brand-muted border border-brand/30 mr-3">
                <Info size={24} color="#00F2FE" />
              </div>
              <Typography variant="h3" color="ink" className="text-xl">
                About SHELLOC
              </Typography>
            </div>
            <Badge label="BIO-CLEANER" status="brand" size="sm" showDot={false} />
          </div>

          <Typography variant="body" color="inkMuted" className="text-sm md:text-base leading-relaxed mb-4">
            <span className="text-brand font-semibold">
              Smart Hydro-Environmental Locator and Cleaner
            </span>{' '}
            is an autonomous robotic vessel deploying natural{' '}
            <span className="text-ink font-medium">Moringa-Chitosan flocculant</span> to eliminate
            suspended particulate matter and restore open water ecosystems.
          </Typography>

          <div className="flex items-center pt-4 border-t border-surface-border gap-6 flex-wrap mt-auto">
            <div className="flex items-center">
              <Zap size={16} color="#10B981" />
              <Typography variant="caption" color="inkSubtle" className="ml-1.5 font-medium text-xs">
                Bio-Flocculation Active
              </Typography>
            </div>
            <div className="flex items-center">
              <Radio size={16} color="#00F2FE" />
              <Typography variant="caption" color="inkSubtle" className="ml-1.5 font-medium text-xs">
                2m Geofence Autonomy
              </Typography>
            </div>
          </div>
        </Card>

        {/* Points Today Card */}
        <Card className="p-6 flex flex-col justify-between items-center md:col-span-1 lg:col-span-1">
          <div className="w-full flex items-center justify-between mb-2">
            <Typography variant="caption" color="inkMuted" className="uppercase font-semibold tracking-wider text-xs">
              Points Today
            </Typography>
            <Badge label="MISSION" status="neutral" size="sm" showDot={false} />
          </div>

          <div className="my-4 relative flex items-center justify-center flex-1">
            <ProgressRing
              progress={pointsProgress}
              size={110}
              strokeWidth={10}
              color="#00F2FE"
              backgroundColor="#1E293B"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Typography variant="h2" color="ink" className="font-bold flex items-baseline text-3xl">
                {pointsTreated}
                <Typography variant="caption" color="inkMuted" className="ml-0.5 text-lg">
                  /{totalWaypoints}
                </Typography>
              </Typography>
            </div>
          </div>

          <Typography variant="caption" color="inkSubtle" className="text-center mt-2 text-xs">
            {totalWaypoints - pointsTreated} waypoints remaining
          </Typography>
        </Card>

        {/* Operation Card */}
        <Card onClick={toggleMode} className="p-6 flex flex-col justify-between cursor-pointer hover:bg-surface-elevated/80 transition-colors md:col-span-1 lg:col-span-1">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-leaf-muted border border-leaf/30">
                <Cpu size={24} color="#10B981" />
              </div>
              <Badge
                label={operationMode.toUpperCase()}
                status={operationMode === 'autonomous' ? 'leaf' : 'amber'}
                size="sm"
              />
            </div>
            <Typography variant="caption" color="inkMuted" className="uppercase font-semibold tracking-wider text-xs">
              Operation
            </Typography>
            <Typography variant="h3" color="ink" className="mt-1 font-bold text-xl">
              {operationMode === 'autonomous' ? 'Autonomous' : 'Manual Mode'}
            </Typography>
            <Typography variant="caption" color="inkSubtle" className="mt-1.5 text-xs">
              {operationMode === 'autonomous' ? 'Self-navigating GPS route' : 'Joystick override active'}
            </Typography>
          </div>

          <div className="mt-6 pt-4 border-t border-surface-border flex items-center justify-between">
            <Typography variant="caption" color="brand" className="font-semibold text-xs">
              Click to Switch
            </Typography>
            <ChevronRight size={16} color="#00F2FE" />
          </div>
        </Card>

        {/* Last Sync Card */}
        <Card className="p-6 flex flex-col justify-between md:col-span-1 lg:col-span-2">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-brand-muted border border-brand/30">
                <Clock size={24} color="#00F2FE" />
              </div>
              <div className="w-3 h-3 rounded-full bg-leaf animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>
            <Typography variant="caption" color="inkMuted" className="uppercase font-semibold tracking-wider text-xs">
              Last Sync
            </Typography>
            <Typography variant="h3" color="ink" className="mt-1 font-bold text-xl">
              Just now
            </Typography>
            <Typography variant="caption" color="leaf" className="mt-1.5 font-medium text-xs">
              • 12 Satellites Locked
            </Typography>
          </div>

          <div className="mt-6 pt-4 border-t border-surface-border">
            <Typography variant="caption" color="inkSubtle" className="text-xs">
              Heartbeat: 5.0s interval
            </Typography>
          </div>
        </Card>

        {/* App Readiness Card */}
        <Card className="p-6 flex flex-col justify-between md:col-span-1 lg:col-span-2">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-leaf-muted border border-leaf/30">
                <ShieldCheck size={24} color="#10B981" />
              </div>
              <Badge label="READY" status="leaf" size="sm" />
            </div>
            <Typography variant="caption" color="inkMuted" className="uppercase font-semibold tracking-wider text-xs">
              App Readiness
            </Typography>
            <Typography variant="h3" color="ink" className="mt-1 font-bold text-xl">
              Operational
            </Typography>
            <Typography variant="caption" color="inkSubtle" className="mt-1.5 text-xs">
              All systems calibrated
            </Typography>
          </div>

          <div className="mt-6 pt-4 border-t border-surface-border flex items-center">
            <CheckCircle2 size={14} color="#10B981" />
            <Typography variant="caption" color="leaf" className="ml-1.5 text-xs font-semibold">
              100% Sensors Online
            </Typography>
          </div>
        </Card>

        {/* Reagent Gauge */}
        <div className="md:col-span-1 lg:col-span-2">
          <ReagentGauge
            moringaPercent={statusData?.flocculant_tank_percent ?? 85}
            citricAcidPercent={statusData?.citric_acid_tank_percent ?? 92}
            biocharStatus={statusData?.biochar_health_status ?? 'optimal'}
          />
        </div>

        {/* Incubation Countdown */}
        {statusData?.mission_state === 'incubating_15m' && (
          <div className="md:col-span-1 lg:col-span-2">
            <CountdownTimer
              timerRemainingSec={statusData.timer_remaining_sec}
              isActive={true}
            />
          </div>
        )}

      </div>

      {/* Quick Action Navigation Bar */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-2">
        <Button
          label="Launch Live Diagnostics & Telemetry"
          variant="primary"
          size="large"
          icon={Activity}
          onClick={() => navigate('/diagnostics')}
          className="flex-1 py-4 text-sm"
        />

        <Button
          label="Setup Waypoint Mission"
          variant="secondary"
          size="large"
          icon={MapPin}
          onClick={() => navigate('/map')}
          className="flex-1 py-4 text-sm"
        />
      </div>
    </div>
  );
}
