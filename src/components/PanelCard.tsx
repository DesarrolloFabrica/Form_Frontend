import { Card, CardContent } from '@/components/Card';
import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

export function PanelCard({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <Card className={cn('overflow-hidden', className)} {...props}>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
}
