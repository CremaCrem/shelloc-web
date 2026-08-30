import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Circle as LeafletCircle } from 'react-leaflet';
import L from 'leaflet';
import {
  Activity,
  Droplet,
  FlaskConical,
  Wind,
  Navigation,
  Radio,
  MapPin,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

import { Typography } from '../components/core/Typography';
import { Card } from '../components/core/Card';
import { Badge } from '../components/core/Badge';
import { Button } from '../components/core/Button';
import { StatCard } from '../components/domain/StatCard';
import { BuoyancyAlert } from '../components/domain/BuoyancyAlert';
import { AdaptiveRemediationBadge } from '../components/domain/AdaptiveRemediationBadge';
import { useTelemetry } from '../hooks/useTelemetry';
import { useWaypoints } from '../hooks/useWaypoints';
import { useDispatchRobot } from '../hooks/useDispatch';

// Create a custom div icon for the robot marker
const createRobotIcon = () =>
  L.divIcon({
    className: 'bg-transparent',
    html: `
      <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
        <div class="w-8 h-8 rounded-full bg-brand/20 border border-brand animate-ping absolute"></div>
        <div class="w-6 h-6 rounded-full bg-brand flex items-center justify-center shadow-md shadow-brand z-10">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0B111E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
          </svg>
        </div>
      </div>
    `,
    iconSize: [0, 0],
  });

const createWaypointIcon = (pointNumber: number, isSelected: boolean, isTreated: boolean) =>
  L.divIcon({
    className: 'bg-transparent',
    html: `
      <div class="w-8 h-8 rounded-full flex items-center justify-center border -translate-x-1/2 -translate-y-1/2 ${
        isSelected
          ? 'bg-brand border-brand shadow-lg shadow-brand'
          : isTreated
          ? 'bg-leaf-muted border-leaf'
          : 'bg-surface-elevated border-amber/60'
      }">
        <span class="font-bold text-[11px] ${
          isSelected ? 'text-ink-dark' : isTreated ? 'text-leaf' : 'text-amber'
        }">P${pointNumber}</span>
      </div>
    `,
    iconSize: [0, 0],
  });

export function Diagnostics() {
  const navigate = useNavigate();
  const { statusData } = useTelemetry();
  const { data: waypointsData } = useWaypoints();
  const dispatchRobot = useDispatchRobot();

  const waypoints = waypointsData || [];
  const [selectedPointIndex, setSelectedPointIndex] = useState(0);

  const selectedWaypoint = waypoints[selectedPointIndex] || null;

  const getComparativeData = (key: 'turbidity_ntu' | 'ph' | 'dissolved_oxygen', baseline: number) => {
    if (!selectedWaypoint) return { before: baseline, after: baseline, delta: 0 };

    const before = selectedWaypoint.before_reading?.[key] ?? baseline;
    const after = selectedWaypoint.after_reading?.[key] ?? before;
    const delta = before > 0 ? ((after - before) / before) * 100 : 0;

    return { before, after, delta };
  };

  const turbidityData = getComparativeData('turbidity_ntu', 124.5);
  const phData = getComparativeData('ph', 5.2);
  const doData = getComparativeData('dissolved_oxygen', 3.8);

  return (
    <div className="p-6 md:p-8 w-full max-w-7xl mx-auto flex flex-col h-full overflow-y-auto">
      {/* Screen Title Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2.5 rounded-xl bg-brand-muted border border-brand/30 mr-3">
            <Activity size={24} color="#00F2FE" />
          </div>
          <div>
            <Typography variant="h2" color="ink" className="font-bold text-2xl">
              Live Diagnostics
            </Typography>
            <Typography variant="caption" color="inkMuted" className="text-sm">
              REAL-TIME SENSOR TELEMETRY & FLOC ANALYSIS
            </Typography>
          </div>
        </div>

        <button
          onClick={() => navigate('/map')}
          className="p-3 rounded-2xl bg-surface-elevated border border-surface-border hover:opacity-70 transition-opacity"
          aria-label="Waypoint mission setup"
        >
          <Sliders size={20} color="#00F2FE" />
        </button>
      </div>

      <BuoyancyAlert isVisible={statusData?.overall_status === 'buoyancy_failsafe' || statusData?.buoyancy_failsafe_active === true} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Left Column: Map & Waypoint Selector */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* 1. Map Overview with Numbered Waypoints */}
          <Card className="p-0 overflow-hidden border border-surface-border bg-surface flex flex-col">
            {/* Map Header Overlay */}
            <div className="p-4 bg-surface/90 border-b border-surface-border flex items-center justify-between relative z-20">
              <div className="flex items-center">
                <Radio size={16} color="#00F2FE" className="mr-2" />
                <Typography variant="h3" color="ink" className="text-base font-semibold">
                  Autonomous Waypoint Radar
                </Typography>
              </div>
              <Badge label="GEOFENCE: 2.0M" status="neutral" size="sm" showDot={false} />
            </div>

            {/* Real Interactive Map Canvas */}
            <div className="h-80 md:h-96 relative overflow-hidden z-10 flex-shrink-0">
              <MapContainer
                center={[14.60012, 120.98565]}
                zoom={18}
                style={{ height: '100%', width: '100%', background: '#0B111E' }}
                zoomControl={false}
                dragging={false}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                {waypoints.map((wp, idx) => {
                  const isSelected = selectedPointIndex === idx;
                  const isTreated = wp.treated;

                  return (
                    <React.Fragment key={wp.id}>
                      <LeafletCircle
                        center={[wp.latitude, wp.longitude]}
                        radius={2.0} // 2 meters
                        pathOptions={{
                          fillColor: isTreated ? '#10B981' : '#F59E0B',
                          fillOpacity: 0.15,
                          color: isTreated ? '#10B981' : '#F59E0B',
                          opacity: 0.4,
                          weight: 1,
                        }}
                      />
                      <Marker
                        position={[wp.latitude, wp.longitude]}
                        icon={createWaypointIcon(wp.point_number, isSelected, isTreated)}
                        eventHandlers={{
                          click: () => setSelectedPointIndex(idx),
                        }}
                      />
                    </React.Fragment>
                  );
                })}

                {/* Robot Current Position Marker */}
                <Marker
                  position={[statusData?.current_lat ?? 14.59972, statusData?.current_lng ?? 120.98491]}
                  icon={createRobotIcon()}
                  zIndexOffset={1000}
                />
              </MapContainer>

              {/* Coordinate HUD Readout */}
              <div className="absolute bottom-3 left-3 bg-surface/85 px-3 py-1.5 rounded-lg border border-surface-border z-20 pointer-events-none">
                <Typography variant="caption" color="inkMuted" className="font-mono text-xs">
                  Vessel: {(statusData?.current_lat ?? 14.59972).toFixed(5)}° N,{' '}
                  {(statusData?.current_lng ?? 120.98491).toFixed(5)}° E
                </Typography>
              </div>
            </div>

            {/* 2. Status Legend Bar */}
            <div className="p-3 bg-surface-elevated border-t border-surface-border flex items-center justify-around relative z-20">
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-leaf mr-2" />
                <Typography variant="caption" color="inkMuted" className="text-xs font-medium">
                  GPS: Good
                </Typography>
              </div>
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-brand mr-2" />
                <Typography variant="caption" color="inkMuted" className="text-xs font-medium">
                  Mode: Auto
                </Typography>
              </div>
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-leaf mr-2" />
                <Typography variant="caption" color="inkMuted" className="text-xs font-medium">
                  Battery: {statusData?.battery_percent ?? 86}%
                </Typography>
              </div>
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-leaf mr-2" />
                <Typography variant="caption" color="inkMuted" className="text-xs font-medium">
                  Floc: Ready
                </Typography>
              </div>
            </div>
          </Card>

          {/* 3. Waypoint Selector Chips */}
          <div>
            <Typography variant="caption" color="inkMuted" className="uppercase font-semibold tracking-wider mb-3 block text-xs">
              Select Waypoint Telemetry Target
            </Typography>
            <div className="flex overflow-x-auto pb-2 -mx-1 snap-x scrollbar-hide">
              {waypoints.map((wp, idx) => {
                const isSelected = selectedPointIndex === idx;
                return (
                  <button
                    key={wp.id}
                    onClick={() => setSelectedPointIndex(idx)}
                    className={`mx-1.5 px-4 py-3 rounded-2xl border flex flex-row items-center whitespace-nowrap shrink-0 snap-start transition-colors ${
                      isSelected
                        ? 'bg-brand border-brand shadow-sm shadow-brand/30'
                        : wp.treated
                        ? 'bg-surface border-surface-border hover:bg-surface-elevated'
                        : 'bg-surface-elevated border-surface-border hover:bg-surface-elevated/80'
                    }`}
                  >
                    <Typography
                      variant="label"
                      color={isSelected ? 'dark' : 'ink'}
                      className="font-bold mr-2 pointer-events-none text-sm"
                    >
                      Point {wp.point_number}
                    </Typography>
                    {wp.treated ? (
                      <CheckCircle2 size={16} color={isSelected ? '#0B111E' : '#10B981'} />
                    ) : (
                      <Badge
                        label="PENDING"
                        status="amber"
                        size="sm"
                        showDot={false}
                        className={isSelected ? 'bg-black/20' : ''}
                      />
                    )}
                  </button>
                );
              })}
              {waypoints.length === 0 && (
                <Typography variant="caption" color="inkMuted" className="italic px-2 text-sm">
                  No active waypoints. Please configure mission.
                </Typography>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Telemetry & Actions */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* 4. Selected Waypoint Header Banner */}
          {selectedWaypoint ? (
            <div className="flex items-start justify-between bg-surface-elevated p-4 rounded-2xl border border-surface-border">
              <div>
                <Typography variant="h2" color="ink" className="font-bold text-xl">
                  {selectedWaypoint.label} Data
                </Typography>
                <Typography variant="caption" color="inkMuted" className="font-mono mt-1 block">
                  {selectedWaypoint.latitude.toFixed(6)}° N, {selectedWaypoint.longitude.toFixed(6)}° E
                </Typography>
              </div>
              <div className="flex flex-col items-end">
                <Badge
                  label={selectedWaypoint.treated ? 'REMEDIATED' : 'UNTREATED'}
                  status={selectedWaypoint.treated ? 'leaf' : 'amber'}
                  size="md"
                />
                <div className="mt-2">
                  <AdaptiveRemediationBadge 
                    reagentType="citric_acid" 
                    isVisible={selectedWaypoint.treated} 
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center bg-surface p-4 rounded-2xl border border-surface-border h-[76px]">
              <Typography variant="caption" color="inkMuted" className="italic text-sm">
                Select a waypoint to view telemetry data
              </Typography>
            </div>
          )}

          {/* 5. Comparative Telemetry Cards (Before vs After) */}
          <div className="flex flex-col gap-4">
            {/* Turbidity Comparative Card */}
            <StatCard
              title="Turbidity Index"
              subtitle="Suspended Solids Aggregation (NTU)"
              category="turbidity"
              icon={Droplet}
              comparative={{
                beforeValue: turbidityData.before.toFixed(1),
                afterValue: turbidityData.after.toFixed(1),
                unit: 'NTU',
                deltaPercent: turbidityData.delta,
                beforeStatus: 'danger',
                beforeStatusLabel: `Critical (${turbidityData.before.toFixed(1)})`,
                afterStatus: selectedWaypoint?.treated ? 'leaf' : 'danger',
                afterStatusLabel: selectedWaypoint?.treated
                  ? `Remediated (${turbidityData.after.toFixed(1)})`
                  : 'Pending',
              }}
            />

            {/* pH Level Comparative Card */}
            <StatCard
              title="Water Acidity / pH Scale"
              subtitle="Chemical Stabilization (0-14 pH)"
              category="ph"
              icon={FlaskConical}
              comparative={{
                beforeValue: phData.before.toFixed(2),
                afterValue: phData.after.toFixed(2),
                unit: 'pH',
                deltaPercent: phData.delta,
                beforeStatus: 'amber',
                beforeStatusLabel: `Acidic (${phData.before.toFixed(2)})`,
                afterStatus: selectedWaypoint?.treated ? 'leaf' : 'amber',
                afterStatusLabel: selectedWaypoint?.treated
                  ? `Optimal (${phData.after.toFixed(2)})`
                  : 'Pending',
              }}
            />

            {/* Dissolved Oxygen Comparative Card */}
            <StatCard
              title="Dissolved Oxygen (DO)"
              subtitle="Aeration & Dissolved Solids (mg/L)"
              category="do"
              icon={Wind}
              comparative={{
                beforeValue: doData.before.toFixed(1),
                afterValue: doData.after.toFixed(1),
                unit: 'mg/L',
                deltaPercent: doData.delta,
                beforeStatus: 'danger',
                beforeStatusLabel: `Hypoxic (${doData.before.toFixed(1)})`,
                afterStatus: selectedWaypoint?.treated ? 'leaf' : 'danger',
                afterStatusLabel: selectedWaypoint?.treated
                  ? `Aerated (${doData.after.toFixed(1)})`
                  : 'Pending',
              }}
            />
          </div>

          {/* 6. Action Bar */}
          <div className="flex flex-col gap-3 mt-auto pt-2">
            <Button
              label={
                selectedWaypoint
                  ? `Dispatch Vessel to Point ${selectedWaypoint.point_number}`
                  : 'Configure Mission'
              }
              variant="primary"
              size="large"
              icon={Navigation}
              disabled={!selectedWaypoint}
              onClick={() => {
                if (selectedWaypoint) {
                  dispatchRobot.mutate(selectedWaypoint.id, {
                    onSuccess: () => alert(`Dispatched SHELLOC vessel to Point ${selectedWaypoint.point_number}`),
                  });
                }
              }}
            />

            <Button
              label="Configure Mission Waypoints"
              variant="secondary"
              size="large"
              icon={MapPin}
              onClick={() => navigate('/map')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
