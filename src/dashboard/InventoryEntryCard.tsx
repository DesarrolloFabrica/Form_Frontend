import { cn } from '@/lib/utils';
import type { DashboardNavItem } from '@/models';
import { motion } from 'framer-motion';
import { ArrowUpRight, Building2, Code2, FileKey, ChevronRight } from 'lucide-react';
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
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(item.href)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(item.href);
        }
      }}
      className={cn(
        // Base y Light Mode
        'group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white/50 p-6 text-left shadow-sm backdrop-blur-md transition-all duration-300',
        'hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30',
        // Dark Mode
        'dark:border-white/6 dark:bg-[#0f1524]/50 dark:hover:border-blue-500/30 dark:hover:bg-[#0f1524]/80 dark:hover:shadow-blue-900/20'
      )}
    >
      {/* Brillo radial de fondo que aparece sutilmente al hacer hover */}
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-linear-to-br from-blue-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-blue-500/10" />

      <div className="relative z-10 flex items-start justify-between gap-4">
        {/* Contenedor del Icono principal */}
        <div className="flex size-12 items-center justify-center rounded-xl bg-linear-to-br from-slate-100 to-slate-50 text-slate-700 ring-1 ring-inset ring-slate-200/80 transition-colors duration-300 group-hover:from-blue-500/10 group-hover:to-indigo-500/10 group-hover:text-blue-600 group-hover:ring-blue-500/20 dark:from-slate-800/50 dark:to-slate-800 dark:text-slate-300 dark:ring-white/10 dark:group-hover:from-blue-400/10 dark:group-hover:to-indigo-400/10 dark:group-hover:text-blue-400">
          <Icon className="size-6 transition-transform duration-300 group-hover:scale-110" />
        </div>

        {/* Icono de flecha superior derecha (Micro-interacción) */}
        <span className="flex size-8 items-center justify-center rounded-full border border-slate-200/60 bg-slate-50 text-slate-400 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600 dark:border-white/5 dark:bg-slate-800/50 dark:group-hover:border-blue-500/20 dark:group-hover:bg-blue-500/10 dark:group-hover:text-blue-400">
          <ArrowUpRight className="size-4" />
        </span>
      </div>

      <div className="relative z-10 mt-5 flex-1 space-y-2">
        <h3 className="text-lg font-bold tracking-tight text-slate-900 transition-colors group-hover:text-blue-600 sm:text-xl dark:text-slate-100 dark:group-hover:text-blue-400">
          {item.title}
        </h3>
        <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {item.description}
        </p>
      </div>

      {/* Botón de llamada a la acción (CTA) */}
      <div className="relative z-10 mt-6 flex items-center">
        <span className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 text-sm font-semibold text-slate-600 transition-all duration-300 group-hover:border-blue-200 group-hover:bg-blue-500/5 group-hover:text-blue-600 dark:border-white/5 dark:bg-slate-800/30 dark:text-slate-300 dark:group-hover:border-blue-500/20 dark:group-hover:bg-blue-500/10 dark:group-hover:text-blue-400">
          Entrar al módulo
          <ChevronRight className="size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
        </span>
      </div>

      {/* Línea inferior brillante animada */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-linear-to-r from-transparent via-blue-500 to-transparent opacity-0 blur-[1px] transition-opacity duration-500 group-hover:opacity-100 dark:via-blue-400" />
    </motion.div>
  );
}