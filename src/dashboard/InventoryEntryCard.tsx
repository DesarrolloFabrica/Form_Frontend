import { cn } from '@/lib/utils';
import type { DashboardNavItem } from '@/models';
import { motion } from 'framer-motion';
import { ArrowUpRight, Building2, Code2, FileKey } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const icons = {
  factory: Building2,
  code: Code2,
  license: FileKey,
} as const;

export interface InventoryEntryCardProps {
  item: DashboardNavItem;
  index: number;
}

export function InventoryEntryCard({ item, index }: InventoryEntryCardProps) {
  const navigate = useNavigate();
  const Icon = icons[item.icon];

  return (
    <motion.div
      role="button"
      tabIndex={0}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.995 }}
      onClick={() => navigate(item.href)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(item.href);
        }
      }}
      className={cn(
        'group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/80 bg-surface-elevated/95 p-6 text-left shadow-lg shadow-black/25 transition-colors',
        'hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35',
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-12 items-center justify-center rounded-xl bg-accent/15 text-accent ring-1 ring-inset ring-accent/25">
          <Icon className="size-6" />
        </div>
        <span className="rounded-full border border-border/70 bg-background/40 p-2 text-muted transition-colors group-hover:border-accent/40 group-hover:text-foreground">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
      <div className="mt-5 space-y-2">
        <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
        <p className="text-sm leading-relaxed text-muted">{item.description}</p>
      </div>
      <div className="mt-6">
        <span className="inline-flex h-9 items-center rounded-lg border border-border/80 bg-surface px-3 text-sm font-medium text-muted transition-colors group-hover:border-accent/35 group-hover:text-foreground">
          Entrar al módulo
        </span>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </motion.div>
  );
}
