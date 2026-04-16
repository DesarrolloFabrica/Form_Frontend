import { Badge } from '@/components/UiPrimitives';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/models';

const roleLabels: Record<UserRole, string> = {
  fabrica: 'Coordinación Fábrica',
  desarrollo: 'Desarrollo',
};

const roleCopy: Record<UserRole, string> = {
  fabrica: 'Gestiona requisiciones de fábrica y el inventario de licencias compartido con otras áreas.',
  desarrollo: 'Administra el inventario de proyectos de desarrollo y las licencias corporativas vinculadas.',
};

export function WelcomeBanner() {
  const { user, role } = useAuth();

  if (role !== 'fabrica' && role !== 'desarrollo') {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-xl transition-colors sm:p-8 dark:border-white/8 dark:bg-[#0f1524]/80 dark:shadow-2xl">
      {/* Luces de fondo sutiles (Glow effects) */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[80px] dark:bg-blue-500/20" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-indigo-500/10 blur-[60px] dark:bg-indigo-500/20" />

      <div className="relative z-10 space-y-4">
        {/* Fila superior: Badge y Estado */}
        <div className="flex items-center gap-3">
          <Badge variant="accent" className="shadow-sm">
            {roleLabels[role]}
          </Badge>
          
          {/* Indicador de sesión activa con animación "ping" */}
          <div className="flex items-center gap-1.5 rounded-full border border-slate-300/80 bg-slate-100 px-2.5 py-1 dark:border-slate-800 dark:bg-slate-800/50">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-400">
              Sesión activa
            </span>
          </div>
        </div>

        {/* Mensaje de bienvenida */}
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
            Hola,{' '}
            {user?.nombre ? (
              <span className="bg-linear-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                {user.nombre}
              </span>
            ) : (
              'Usuario'
            )}
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-700 sm:text-base dark:text-slate-400">
            {roleCopy[role]}
          </p>
        </div>
      </div>
    </div>
  );
}