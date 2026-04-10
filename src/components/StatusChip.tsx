import { cn } from '@/lib/utils';

const toneMap = {
  neutral: 'bg-surface-elevated text-foreground border-border',
  info: 'bg-blue-500/15 text-blue-100 border-blue-500/35',
  success: 'bg-emerald-500/15 text-emerald-100 border-emerald-500/35',
  warning: 'bg-amber-500/15 text-amber-100 border-amber-500/35',
  danger: 'bg-red-500/15 text-red-100 border-red-500/35',
} as const;

export interface StatusChipProps {
  label: string;
  tone?: keyof typeof toneMap;
  className?: string;
}

export function StatusChip({ label, tone = 'neutral', className }: StatusChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        toneMap[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}
