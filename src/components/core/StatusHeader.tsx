import React from 'react';
import { Bot, Wifi, WifiOff, Battery, BatteryCharging, Radio } from 'lucide-react';
import { Typography } from './Typography';
import { Badge, type BadgeStatus } from './Badge';

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting';
export type RobotState = 'idle' | 'cleaning' | 'navigating' | 'treating' | 'error';

interface StatusHeaderProps {
  robotName?: string;
  connection: ConnectionStatus;
  state?: RobotState;
  operationMode?: 'autonomous' | 'manual';
  batteryPercent?: number;
  gpsSignal?: 'good' | 'weak' | 'none';
}

export function StatusHeader({
  robotName = 'SHELLOC-01',
  connection = 'connected',
  state = 'idle',
  operationMode = 'autonomous',
  batteryPercent = 85,
  gpsSignal = 'good',
}: StatusHeaderProps) {
  let connectionBadgeStatus: BadgeStatus = 'neutral';
  let connectionLabel = 'Offline';
  let WifiIcon = WifiOff;
  let wifiColor = '#64748B';

  switch (connection) {
    case 'connected':
      connectionBadgeStatus = 'leaf';
      connectionLabel = 'Online';
      WifiIcon = Wifi;
      wifiColor = '#10B981';
      break;
    case 'connecting':
      connectionBadgeStatus = 'amber';
      connectionLabel = 'Syncing';
      WifiIcon = Radio;
      wifiColor = '#F59E0B';
      break;
    case 'disconnected':
    default:
      connectionBadgeStatus = 'neutral';
      connectionLabel = 'Offline';
      WifiIcon = WifiOff;
      wifiColor = '#64748B';
      break;
  }

  const batteryColor =
    batteryPercent > 50
      ? '#10B981'
      : batteryPercent > 20
      ? '#F59E0B'
      : '#EF4444';

  return (
    <div className="px-6 py-4 bg-surface border-b border-surface-border sticky top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Left: Robot identity */}
        <div className="flex items-center flex-1 mr-2">
          <div className="bg-surface-elevated border border-surface-border p-2.5 rounded-2xl mr-3 shrink-0">
            <Bot size={22} color="#00F2FE" />
          </div>
          <div className="shrink min-w-0">
            <div className="flex items-center flex-wrap gap-2">
              <Typography variant="h3" color="ink" className="mr-1 shrink truncate">
                {robotName}
              </Typography>
              <Badge
                label={operationMode.toUpperCase()}
                status={operationMode === 'autonomous' ? 'leaf' : 'amber'}
                size="sm"
              />
            </div>
            <div className="flex items-center mt-1">
              <div
                className={`w-2 h-2 rounded-full mr-1.5 ${
                  connection === 'connected'
                    ? 'bg-leaf'
                    : connection === 'connecting'
                    ? 'bg-amber'
                    : 'bg-ink-subtle'
                }`}
              />
              <Typography variant="caption" color="inkMuted" className="capitalize">
                {connection === 'connected' ? `State: ${state}` : connectionLabel}
              </Typography>
              {gpsSignal && (
                <>
                  <Typography variant="caption" color="inkSubtle" className="mx-1.5">
                    •
                  </Typography>
                  <Typography
                    variant="caption"
                    color={gpsSignal === 'good' ? 'leaf' : 'amber'}
                  >
                    GPS: {gpsSignal.toUpperCase()}
                  </Typography>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick telemetry pills */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Battery Chip */}
          <div className="flex items-center bg-surface-elevated border border-surface-border px-2.5 py-1.5 rounded-xl mr-2">
            <Battery size={16} color={batteryColor} />
            <Typography variant="caption" color="ink" className="ml-1 font-semibold">
              {batteryPercent}%
            </Typography>
          </div>

          {/* Connection Chip */}
          <div className="bg-surface-elevated border border-surface-border p-2 rounded-xl">
            <WifiIcon size={16} color={wifiColor} />
          </div>
        </div>
      </div>
    </div>
  );
}
