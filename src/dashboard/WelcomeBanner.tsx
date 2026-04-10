import { Badge } from '@/components/Badge';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/models';

const roleLabels: Record<Extract<UserRole, 'FABRICA_COORDINADOR' | 'DESARROLLO'>, string> = {
  FABRICA_COORDINADOR: 'Coordinación Fábrica',
  DESARROLLO: 'Desarrollo',
};

const roleCopy: Record<Extract<UserRole, 'FABRICA_COORDINADOR' | 'DESARROLLO'>, string> = {
  FABRICA_COORDINADOR:
    'Gestiona requisiciones de fábrica y el inventario de licencias compartido con otras áreas.',
  DESARROLLO:
    'Administra el inventario de proyectos de desarrollo y las licencias corporativas vinculadas.',
};

export function WelcomeBanner() {
  const { user, role } = useAuth();

  if (role !== 'FABRICA_COORDINADOR' && role !== 'DESARROLLO') {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-surface-elevated via-surface-elevated to-[#152036] p-6 shadow-xl shadow-black/30 sm:p-8">
      <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-accent/10 blur-3xl" />
      <div className="relative space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="accent">{roleLabels[role]}</Badge>
          <span className="text-xs text-muted">Sesión mock · datos locales</span>
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Hola, {user?.displayName ?? 'usuario'}
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted">{roleCopy[role]}</p>
      </div>
    </div>
  );
}
