import React from 'react';
import { cn } from '../../lib/utils';
import { Typography, type TypographyColor } from './Typography';

export type BadgeStatus = 'leaf' | 'amber' | 'danger' | 'brand' | 'neutral';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  status?: BadgeStatus;
  showDot?: boolean;
  size?: 'sm' | 'md';
}

export function Badge({
  label,
  status = 'neutral',
  showDot = true,
  size = 'sm',
  className = '',
  ...rest
}: BadgeProps) {
  let bgClass = 'bg-surface-elevated border-surface-border';
  let dotClass = 'bg-ink-subtle';
  let textColor: TypographyColor = 'inkMuted';

  switch (status) {
    case 'leaf':
      bgClass = 'bg-leaf-muted border-leaf/40';
      dotClass = 'bg-leaf';
      textColor = 'leaf';
      break;
    case 'amber':
      bgClass = 'bg-amber-muted border-amber/40';
      dotClass = 'bg-amber';
      textColor = 'amber';
      break;
    case 'danger':
      bgClass = 'bg-danger-muted border-danger/40';
      dotClass = 'bg-danger';
      textColor = 'danger';
      break;
    case 'brand':
      bgClass = 'bg-brand-muted border-brand/40';
      dotClass = 'bg-brand';
      textColor = 'brand';
      break;
    case 'neutral':
    default:
      bgClass = 'bg-surface-elevated border-surface-border';
      dotClass = 'bg-ink-subtle';
      textColor = 'inkMuted';
      break;
  }

  const paddingClass = size === 'sm' ? 'px-2.5 py-1' : 'px-3.5 py-1.5';
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center self-start flex-shrink border',
        paddingClass,
        bgClass,
        className
      )}
      {...rest}
    >
      {showDot && (
        <div className={cn(dotSize, 'rounded-full mr-1.5 flex-shrink-0', dotClass)} />
      )}
      <Typography
        variant="caption"
        color={textColor}
        className="font-semibold uppercase tracking-wider text-center leading-none flex-shrink truncate"
      >
        {label}
      </Typography>
    </div>
  );
}
