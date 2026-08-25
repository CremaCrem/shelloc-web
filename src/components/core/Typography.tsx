import React from 'react';
import { cn } from '../../lib/utils';

export type TypographyVariant = 'h1' | 'h2' | 'h3' | 'body' | 'label' | 'caption';
export type TypographyColor = 
  | 'ink' 
  | 'inkMuted' 
  | 'inkSubtle' 
  | 'brand' 
  | 'leaf' 
  | 'danger' 
  | 'amber' 
  | 'white' 
  | 'dark';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  color?: TypographyColor;
  className?: string;
  children?: React.ReactNode;
  as?: React.ElementType;
}

export function Typography({
  variant = 'body',
  color = 'ink',
  className = '',
  as,
  children,
  ...rest
}: TypographyProps) {
  let variantStyles = '';
  let DefaultTag: React.ElementType = 'p';

  switch (variant) {
    case 'h1':
      variantStyles = 'text-3xl font-bold leading-tight tracking-tight';
      DefaultTag = 'h1';
      break;
    case 'h2':
      variantStyles = 'text-2xl font-semibold leading-snug tracking-tight';
      DefaultTag = 'h2';
      break;
    case 'h3':
      variantStyles = 'text-lg font-semibold leading-snug';
      DefaultTag = 'h3';
      break;
    case 'body':
      variantStyles = 'text-base font-normal leading-relaxed';
      DefaultTag = 'p';
      break;
    case 'label':
      variantStyles = 'text-sm font-medium leading-normal';
      DefaultTag = 'span';
      break;
    case 'caption':
      variantStyles = 'text-xs font-normal leading-normal';
      DefaultTag = 'span';
      break;
  }

  let colorStyles = '';
  switch (color) {
    case 'ink': colorStyles = 'text-ink'; break;
    case 'inkMuted': colorStyles = 'text-ink-muted'; break;
    case 'inkSubtle': colorStyles = 'text-ink-subtle'; break;
    case 'brand': colorStyles = 'text-brand'; break;
    case 'leaf': colorStyles = 'text-leaf'; break;
    case 'danger': colorStyles = 'text-danger'; break;
    case 'amber': colorStyles = 'text-amber'; break;
    case 'white': colorStyles = 'text-white'; break;
    case 'dark': colorStyles = 'text-ink-dark'; break;
  }

  const Tag = as || DefaultTag;

  return (
    <Tag
      className={cn(variantStyles, colorStyles, className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
