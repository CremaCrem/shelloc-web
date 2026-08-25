import React from 'react';
import { cn } from '../../lib/utils';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'highlight';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  as?: React.ElementType;
}

export function Card({
  className = '',
  variant = 'default',
  as,
  children,
  onClick,
  ...rest
}: CardProps) {
  let variantStyles = 'bg-surface border-surface-border';
  
  switch (variant) {
    case 'elevated':
      variantStyles = 'bg-surface-elevated border-surface-border shadow-md';
      break;
    case 'outlined':
      variantStyles = 'bg-transparent border-surface-border';
      break;
    case 'highlight':
      variantStyles = 'bg-surface border-brand/50 shadow-sm';
      break;
    case 'default':
    default:
      variantStyles = 'bg-surface border-surface-border shadow-sm';
      break;
  }

  const baseStyles = 'rounded-3xl p-5 border';
  
  // Optional hover state if clickable
  const interactiveStyles = onClick ? 'cursor-pointer hover:scale-[0.98] transition-transform duration-200' : '';

  const Tag = as || (onClick ? 'button' : 'div');

  return (
    <Tag
      className={cn(baseStyles, variantStyles, interactiveStyles, className)}
      onClick={onClick}
      {...(onClick && !as ? { type: 'button' } : {})}
      {...rest}
    >
      {children}
    </Tag>
  );
}
