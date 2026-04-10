import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

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
