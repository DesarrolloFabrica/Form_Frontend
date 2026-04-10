import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

const variants = {
  default: 'bg-surface-elevated text-foreground border border-border',
  accent: 'bg-accent/15 text-blue-200 border border-accent/30',
  success: 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-100 border border-amber-500/30',
} as const;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants;
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
