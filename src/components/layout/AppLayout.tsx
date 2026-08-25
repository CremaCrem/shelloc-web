import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, Map, Droplet, Bot } from 'lucide-react';
import { StatusHeader } from '../core/StatusHeader';
import { useTelemetry } from '../../hooks/useTelemetry';
import { cn } from '../../lib/utils';

export function AppLayout() {
  const { statusData, isLoading, isError } = useTelemetry();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/diagnostics', label: 'Diagnostics', icon: Activity },
    { to: '/map', label: 'Map', icon: Map },
    { to: '/treatments', label: 'Treatments', icon: Droplet },
    { to: '/chat', label: 'AI Insights', icon: Bot },
  ];

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-background text-ink overflow-hidden">
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-surface-border z-50 shrink-0">
        <div className="p-6 border-b border-surface-border">
          <h1 className="text-xl font-bold text-ink">SHELLOC</h1>
          <p className="text-xs text-brand mt-1">Bio-Cleaner Portal</p>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-3 py-3 rounded-xl transition-colors group',
                  isActive ? 'bg-brand/10 text-brand' : 'text-ink-subtle hover:bg-surface-elevated hover:text-ink'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} className={cn("mr-3", isActive ? "text-brand" : "text-ink-subtle group-hover:text-ink")} />
                  <span className="text-sm font-semibold tracking-wide">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Global Status Header */}
        <StatusHeader
          robotName={statusData?.robot_id || 'SHELLOC-01'}
          connection={isError ? 'disconnected' : isLoading ? 'connecting' : 'connected'}
          state={statusData?.is_active ? 'cleaning' : 'idle'}
          operationMode="autonomous"
          batteryPercent={statusData?.battery_percent ?? 86}
          gpsSignal="good"
        />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative bg-background">
          <Outlet />
        </main>

        {/* Mobile Bottom Tab Bar */}
        <nav className="md:hidden bg-surface border-t border-surface-border h-16 flex items-center justify-around pb-safe pt-1 px-2 shrink-0 z-50">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center w-16 h-full transition-colors',
                  isActive ? 'text-brand' : 'text-ink-subtle hover:text-ink-muted'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={22} className={cn("mb-1", isActive ? "text-brand" : "text-ink-subtle")} />
                  <span className="text-[10px] font-semibold tracking-wide">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
