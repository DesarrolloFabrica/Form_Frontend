import { cn } from '@/lib/utils';

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
