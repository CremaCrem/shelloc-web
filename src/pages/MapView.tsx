import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Circle as LeafletCircle, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, Layers, Battery, MapPin, Zap, Pause, Play, Home } from 'lucide-react';
import { Typography } from '../components/core/Typography';
import { Badge } from '../components/core/Badge';
import { useTelemetry } from '../hooks/useTelemetry';
import { useWaypoints } from '../hooks/useWaypoints';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/utils';

// Reuse icon creators from Diagnostics for consistency
const createRobotIcon = (isActive: boolean) =>
  L.divIcon({
    className: 'bg-transparent',
    html: `
      <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
        ${isActive ? '<div class="w-10 h-10 rounded-full bg-brand/20 border border-brand animate-ping absolute"></div>' : ''}
        <div class="w-8 h-8 rounded-full bg-brand flex items-center justify-center shadow-lg shadow-brand/50 border-2 border-[#0B111E] z-10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0B111E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
          </svg>
        </div>
      </div>
    `,
    iconSize: [0, 0],
  });

const createWaypointIcon = (pointNumber: number, isTreated: boolean) =>
  L.divIcon({
    className: 'bg-transparent',
    html: `
      <div class="w-6 h-6 rounded-full flex items-center justify-center border -translate-x-1/2 -translate-y-1/2 ${
        isTreated ? 'bg-leaf-muted border-leaf' : 'bg-surface-elevated border-amber/60'
      }">
        <span class="font-bold text-[9px] ${isTreated ? 'text-leaf' : 'text-amber'}">P${pointNumber}</span>
      </div>
    `,
    iconSize: [0, 0],
  });

export function MapView() {
  const navigate = useNavigate();
  const { statusData } = useTelemetry();
  const { data: waypointsData } = useWaypoints();
  const geofenceRadius = useAppStore(state => state.geofenceRadiusMeters);
  
  const [showGeofence, setShowGeofence] = useState(true);
  
  const waypoints = waypointsData || [];
  
  const currentLat = statusData?.current_lat ?? 14.59972;
  const currentLng = statusData?.current_lng ?? 120.98491;
  const isActive = statusData?.is_active ?? false;

  // Derive route coordinates (Current Pos -> Waypoint 1 -> Waypoint 2 ...)
  const routeCoordinates = [
    [currentLat, currentLng] as [number, number],
    ...waypoints.filter(wp => !wp.treated).map(wp => [wp.latitude, wp.longitude] as [number, number])
  ];

  return (
    <div className="relative w-full h-full bg-background flex flex-col">
      <div className="flex-1 relative">
        <MapContainer
          center={[currentLat, currentLng]}
          zoom={17}
          style={{ height: '100%', width: '100%', background: '#0B111E' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />

          {/* Planned Route Line */}
          {routeCoordinates.length > 1 && (
            <Polyline
              positions={routeCoordinates}
              pathOptions={{
                color: '#00F2FE',
                weight: 3,
                opacity: 0.5,
                dashArray: '5, 5',
              }}
            />
          )}

          {/* Waypoints */}
          {waypoints.map((wp) => (
            <React.Fragment key={wp.id}>
              {showGeofence && (
                <LeafletCircle
                  center={[wp.latitude, wp.longitude]}
                  radius={geofenceRadius * 10} // visually scale for demo
                  pathOptions={{
                    fillColor: wp.treated ? '#10B981' : '#F59E0B',
                    fillOpacity: 0.1,
                    color: wp.treated ? '#10B981' : '#F59E0B',
                    opacity: 0.3,
                    weight: 1,
                  }}
                />
              )}
              <Marker
                position={[wp.latitude, wp.longitude]}
                icon={createWaypointIcon(wp.point_number, wp.treated)}
              />
            </React.Fragment>
          ))}

          {/* Active Vessel Marker */}
          <Marker
            position={[currentLat, currentLng]}
            icon={createRobotIcon(isActive)}
            zIndexOffset={1000}
          />
        </MapContainer>

        {/* Top Header HUD */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none z-[1000]">
          <div className="bg-surface/90 border border-surface-border rounded-2xl p-3 shadow-lg shadow-black/50 backdrop-blur-sm">
            <div className="flex items-center mb-1">
              <div className="w-2 h-2 rounded-full bg-brand mr-2 animate-pulse" />
              <Typography variant="label" color="ink" className="font-bold">
                {statusData?.robot_id || 'SHELLOC-01'}
              </Typography>
            </div>
            <Typography variant="caption" color="inkMuted" className="font-mono text-[10px] block">
              {currentLat.toFixed(6)}° N
            </Typography>
            <Typography variant="caption" color="inkMuted" className="font-mono text-[10px] block">
              {currentLng.toFixed(6)}° E
            </Typography>
          </div>

          <div className="flex flex-col items-end gap-2 pointer-events-auto">
            <div className="bg-surface/90 border border-surface-border rounded-2xl px-3 py-2 shadow-lg shadow-black/50 flex items-center backdrop-blur-sm">
              <Battery size={14} color="#10B981" className="mr-1.5" />
              <Typography variant="caption" color="ink" className="font-bold">
                {statusData?.battery_percent ?? 100}%
              </Typography>
            </div>
            <Badge 
              label={isActive ? 'NAVIGATING' : 'STANDBY'} 
              status={isActive ? 'brand' : 'neutral'} 
              size="sm" 
            />
          </div>
        </div>

        {/* Right Side Map Controls HUD */}
        <div className="absolute top-1/3 right-4 bg-surface/90 border border-surface-border rounded-2xl shadow-lg shadow-black/50 flex flex-col z-[1000] backdrop-blur-sm">
          <button 
            className="p-3 border-b border-surface-border flex items-center justify-center hover:bg-white/5 transition-colors"
            onClick={() => setShowGeofence(!showGeofence)}
            title="Toggle Geofence"
          >
            <Layers size={20} color={showGeofence ? "#00F2FE" : "#94A3B8"} />
          </button>
          <button 
            className="p-3 flex items-center justify-center hover:bg-white/5 transition-colors"
            onClick={() => { /* Open setup modal or navigate in real app */ }}
            title="Mission Setup"
          >
            <MapPin size={20} color="#F8FAFC" />
          </button>
        </div>

        {/* Bottom Quick Action HUD */}
        <div className="absolute bottom-6 left-4 right-4 bg-surface/95 border border-surface-border rounded-3xl p-4 md:p-6 shadow-xl shadow-black/50 flex justify-around items-center z-[1000] backdrop-blur-md max-w-lg md:max-w-2xl mx-auto">
          <button className="flex flex-col items-center justify-center hover:opacity-70 transition-opacity">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-surface-elevated flex items-center justify-center mb-1 md:mb-2 shadow-sm">
              {isActive ? (
                <Pause size={20} color="#EF4444" className="md:w-6 md:h-6" />
              ) : (
                <Play size={20} color="#10B981" className="md:w-6 md:h-6" />
              )}
            </div>
            <Typography variant="caption" color="inkMuted" className="text-[10px] md:text-xs font-bold">
              {isActive ? 'PAUSE' : 'RESUME'}
            </Typography>
          </button>

          <button className="flex flex-col items-center justify-center hover:opacity-70 transition-opacity">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-brand/10 border border-brand flex items-center justify-center mb-1 md:mb-2 shadow-md shadow-brand/20">
              <Zap size={24} color="#00F2FE" className="md:w-7 md:h-7" />
            </div>
            <Typography variant="caption" color="brand" className="text-[10px] md:text-xs font-bold">
              FLOC BOOST
            </Typography>
          </button>

          <button className="flex flex-col items-center justify-center hover:opacity-70 transition-opacity">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-surface-elevated flex items-center justify-center mb-1 md:mb-2 shadow-sm">
              <Home size={20} color="#F59E0B" className="md:w-6 md:h-6" />
            </div>
            <Typography variant="caption" color="inkMuted" className="text-[10px] md:text-xs font-bold">
              RTH
            </Typography>
          </button>
        </div>
      </div>
    </div>
  );
}
