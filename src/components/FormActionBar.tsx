import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export interface FormActionBarProps {
  children: ReactNode;
  className?: string;
}

export function FormActionBar({ children, className }: FormActionBarProps) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-3 border-t border-border/70 pt-5 sm:flex-row sm:justify-end',
        className,
      )}
    >
      {children}
    </div>
  );
}
