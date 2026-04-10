import { appConfig } from '@/config/app.config';
import { cn } from '@/lib/utils';

export interface LogoProps {
  className?: string;
  size?: 'sm' | 'md';
}

export function Logo({ className, size = 'md' }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-lg bg-accent font-bold text-white shadow-lg shadow-accent/25',
          size === 'sm' ? 'size-8 text-xs' : 'size-10 text-sm',
        )}
      >
        FC
      </div>
      <div className="leading-tight">
        <p className={cn('font-semibold text-foreground', size === 'sm' ? 'text-sm' : 'text-base')}>
          {appConfig.shortName}
        </p>
        <p className="text-xs text-muted">Panel corporativo</p>
      </div>
    </div>
  );
}
