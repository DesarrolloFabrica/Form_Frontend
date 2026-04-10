import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

export function SectionWrapper({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <section className={cn('space-y-6', className)} {...props} />;
}
