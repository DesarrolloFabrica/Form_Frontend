import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export interface LoadingProps {
  label?: string;
  fullScreen?: boolean;
  className?: string;
}

export function Loading({ label = 'Cargando…', fullScreen, className }: LoadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 text-muted',
        fullScreen && 'min-h-[40vh]',
        className,
      )}
    >
      <span className="size-9 animate-spin rounded-full border-2 border-border border-t-accent" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-surface/40 px-6 py-12 text-center',
        className,
      )}
    >
      {icon ? <div className="mb-3 text-muted">{icon}</div> : null}
      <p className="text-base font-medium text-foreground">{title}</p>
      {description ? <p className="mt-1 max-w-md text-sm text-muted">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
