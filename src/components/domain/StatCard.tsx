import React from 'react';
import { Card } from '../core/Card';
import { Typography } from '../core/Typography';
import { Badge, type BadgeStatus } from '../core/Badge';
import { Sparkline } from './Sparkline';
import { type LucideIcon, ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';

export type StatCategory = 'turbidity' | 'ph' | 'tds' | 'do' | 'temperature' | 'general';

interface ComparativeData {
  beforeValue: string | number;
  afterValue: string | number;
  unit?: string;
  deltaPercent?: number;
  beforeStatus?: BadgeStatus;
  beforeStatusLabel?: string;
  afterStatus?: BadgeStatus;
  afterStatusLabel?: string;
}

interface StatCardProps {
  title: string;
  category: StatCategory;
  icon: LucideIcon;
  value?: string | number;
  unit?: string;
  status?: BadgeStatus;
  statusLabel?: string;
  historyData?: number[];
  subtitle?: string;
  comparative?: ComparativeData;
  onClick?: () => void;
  className?: string;
}

export function StatCard({
  title,
  category,
  icon: Icon,
  value,
  unit,
  status,
  statusLabel,
  historyData,
  subtitle,
  comparative,
  onClick,
  className = '',
}: StatCardProps) {
  let iconColor = '#00F2FE';
  let iconBgClass = 'bg-brand-muted border-brand/30';

  switch (category) {
    case 'turbidity':
      iconColor = '#00F2FE';
      iconBgClass = 'bg-brand-muted border-brand/30';
      break;
    case 'ph':
      iconColor = '#10B981';
      iconBgClass = 'bg-leaf-muted border-leaf/30';
      break;
    case 'tds':
      iconColor = '#F59E0B';
      iconBgClass = 'bg-amber-muted border-amber/30';
      break;
    case 'do':
      iconColor = '#38BDF8';
      iconBgClass = 'bg-sky-500/15 border-sky-500/30';
      break;
    case 'temperature':
      iconColor = '#F97316';
      iconBgClass = 'bg-orange-500/15 border-orange-500/30';
      break;
    case 'general':
    default:
      iconColor = '#00F2FE';
      iconBgClass = 'bg-brand-muted border-brand/30';
      break;
  }

  if (comparative) {
    const {
      beforeValue,
      afterValue,
      unit: compUnit = '',
      deltaPercent,
      beforeStatus = 'danger',
      beforeStatusLabel = 'Untreated',
      afterStatus = 'leaf',
      afterStatusLabel = 'Remediated',
    } = comparative;

    const isReductionGood = category === 'turbidity' || category === 'tds';
    const isImproved =
      deltaPercent !== undefined
        ? isReductionGood
          ? deltaPercent < 0
          : deltaPercent > 0
        : true;

    return (
      <Card onClick={onClick} className={cn('p-5 mb-4', className)}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div
              className={`p-2.5 rounded-2xl border ${iconBgClass} mr-3 flex items-center justify-center`}
            >
              <Icon size={20} color={iconColor} />
            </div>
            <div>
              <Typography variant="h3" color="ink">
                {title}
              </Typography>
              <Typography variant="caption" color="inkSubtle">
                {subtitle || 'Treatment Efficiency Comparison'}
              </Typography>
            </div>
          </div>

          {deltaPercent !== undefined && (
            <div
              className={`flex items-center px-2.5 py-1 rounded-full border ${
                isImproved
                  ? 'bg-leaf-muted border-leaf/40'
                  : 'bg-danger-muted border-danger/40'
              }`}
            >
              {deltaPercent < 0 ? (
                <ArrowDownRight size={14} color={isImproved ? '#10B981' : '#EF4444'} />
              ) : deltaPercent > 0 ? (
                <ArrowUpRight size={14} color={isImproved ? '#10B981' : '#EF4444'} />
              ) : (
                <Minus size={14} color="#94A3B8" />
              )}
              <Typography
                variant="caption"
                color={isImproved ? 'leaf' : 'danger'}
                className="font-bold ml-0.5"
              >
                {Math.abs(deltaPercent).toFixed(1)}%
              </Typography>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <div className="flex-1 bg-surface-elevated border border-surface-border rounded-2xl p-3.5">
            <div className="flex items-center justify-between mb-2">
              <Typography variant="caption" color="inkSubtle" className="uppercase font-semibold">
                Before
              </Typography>
              <Badge label={beforeStatusLabel} status={beforeStatus} size="sm" />
            </div>
            <div className="flex items-baseline">
              <Typography variant="h2" color="ink" className="mr-1">
                {beforeValue}
              </Typography>
              {compUnit && (
                <Typography variant="caption" color="inkMuted">
                  {compUnit}
                </Typography>
              )}
            </div>
          </div>

          <div className="flex-1 bg-surface-elevated border border-brand/40 rounded-2xl p-3.5">
            <div className="flex items-center justify-between mb-2">
              <Typography variant="caption" color="brand" className="uppercase font-semibold">
                After
              </Typography>
              <Badge label={afterStatusLabel} status={afterStatus} size="sm" />
            </div>
            <div className="flex items-baseline">
              <Typography variant="h2" color="brand" className="mr-1 font-bold">
                {afterValue}
              </Typography>
              {compUnit && (
                <Typography variant="caption" color="brand">
                  {compUnit}
                </Typography>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card onClick={onClick} className={cn('flex flex-col flex-1 min-w-[150px] p-5', className)}>
      <div className="flex justify-between items-start mb-3">
        <div
          className={`p-2.5 rounded-2xl border ${iconBgClass} flex items-center justify-center`}
        >
          <Icon size={20} color={iconColor} />
        </div>
        {status && statusLabel && <Badge label={statusLabel} status={status} />}
      </div>

      <Typography
        variant="caption"
        color="inkMuted"
        className="uppercase tracking-wider font-semibold mb-1"
      >
        {title}
      </Typography>

      <div className="flex items-baseline mb-2">
        <Typography variant="h1" color="ink" className="mr-1 font-bold">
          {value ?? '--'}
        </Typography>
        {unit && (
          <Typography variant="body" color="inkMuted">
            {unit}
          </Typography>
        )}
      </div>

      {subtitle && (
        <Typography variant="caption" color="inkSubtle" className="mb-2">
          {subtitle}
        </Typography>
      )}

      {historyData && historyData.length > 0 && (
        <div className="h-10 mt-auto pt-2">
          <Sparkline data={historyData} color={iconColor} strokeWidth={2.5} />
        </div>
      )}
    </Card>
  );
}
