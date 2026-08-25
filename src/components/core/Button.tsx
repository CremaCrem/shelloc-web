import React from 'react';
import { cn } from '../../lib/utils';
import { Typography, type TypographyColor } from './Typography';
import { type LucideIcon, Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  iconColor?: string;
  loading?: boolean;
}

export function Button({
  label,
  variant = 'primary',
  size = 'medium',
  icon: Icon,
  iconRight: IconRight,
  iconColor,
  loading = false,
  className = '',
  disabled,
  children,
  ...rest
}: ButtonProps) {
  let variantStyles = '';
  let defaultTextColor: TypographyColor = 'dark';
  let defaultIconColor = '#0B111E';

  switch (variant) {
    case 'primary':
      variantStyles = 'bg-brand border-brand hover:bg-brand-dark hover:border-brand-dark text-ink-dark';
      defaultTextColor = 'dark';
      defaultIconColor = '#0B111E';
      break;
    case 'secondary':
      variantStyles = 'bg-surface-elevated border-surface-border hover:bg-surface-hover text-ink';
      defaultTextColor = 'ink';
      defaultIconColor = '#F8FAFC';
      break;
    case 'danger':
      variantStyles = 'bg-danger border-danger hover:bg-danger-dark text-white';
      defaultTextColor = 'white';
      defaultIconColor = '#FFFFFF';
      break;
    case 'outline':
      variantStyles = 'bg-transparent border-brand text-brand hover:bg-brand-muted';
      defaultTextColor = 'brand';
      defaultIconColor = '#00F2FE';
      break;
    case 'ghost':
      variantStyles = 'bg-transparent border-transparent hover:bg-surface-elevated text-ink-muted';
      defaultTextColor = 'inkMuted';
      defaultIconColor = '#94A3B8';
      break;
  }

  let sizeStyles = 'px-5 py-3 min-h-[44px]';
  let iconSize = 18;
  let labelVariant: 'label' | 'body' | 'caption' = 'label';

  switch (size) {
    case 'small':
      sizeStyles = 'px-3.5 py-1.5 min-h-[36px]';
      iconSize = 14;
      labelVariant = 'caption';
      break;
    case 'medium':
      sizeStyles = 'px-5 py-2.5 min-h-[44px]';
      iconSize = 18;
      labelVariant = 'label';
      break;
    case 'large':
      sizeStyles = 'px-6 py-3.5 min-h-[52px]';
      iconSize = 20;
      labelVariant = 'body';
      break;
  }

  const finalIconColor = iconColor || defaultIconColor;
  const isInteractive = !disabled && !loading;

  return (
    <button
      className={cn(
        'rounded-full flex items-center justify-center border transition-all duration-200 outline-none focus:ring-2 focus:ring-brand/50',
        variantStyles,
        sizeStyles,
        !isInteractive && 'opacity-50 cursor-not-allowed',
        isInteractive && 'active:scale-95 cursor-pointer',
        className
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <Loader2 size={iconSize} color={finalIconColor} className="animate-spin" />
      ) : (
        <>
          {Icon && (
            <div className={label || children ? 'mr-2' : ''}>
              <Icon size={iconSize} color={finalIconColor} />
            </div>
          )}

          {label && (
            <Typography
              variant={labelVariant}
              color={defaultTextColor}
              className="font-semibold text-center pointer-events-none"
            >
              {label}
            </Typography>
          )}

          {children}

          {IconRight && (
            <div className={label || children ? 'ml-2' : ''}>
              <IconRight size={iconSize} color={finalIconColor} />
            </div>
          )}
        </>
      )}
    </button>
  );
}
