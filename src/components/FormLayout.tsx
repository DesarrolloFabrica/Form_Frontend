import { cn } from '@/lib/utils';
import type { HTMLAttributes, ReactNode } from 'react';

export function FormFieldGrid({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('grid gap-5 sm:grid-cols-2 lg:grid-cols-3', className)}
      {...props}
    />
  );
}

export function FormSection({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-4', className)} {...props} />;
}

export function FormSectionTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-sm font-semibold uppercase tracking-wide text-muted', className)} {...props} />
  );
}

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
