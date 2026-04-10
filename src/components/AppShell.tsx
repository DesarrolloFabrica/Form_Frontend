import { appConfig } from '@/config/app.config';
import { Button } from '@/components/UiPrimitives';
import { useAuth } from '@/hooks/useAuth';
import { useRoleNavigation } from '@/hooks/useRoleNavigation';
import { cn } from '@/lib/utils';
import { ArrowLeft, LogOut, Menu } from 'lucide-react';
import { type ComponentProps, type ReactNode, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

/* —— Logo —— */
export interface LogoProps {
  className?: string;
  size?: 'sm' | 'md';
}

export function Logo({ className, size = 'md' }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-lg bg-accent font-bold text-white shadow-lg shadow-accent/25',
          size === 'sm' ? 'size-8 text-xs' : 'size-10 text-sm',
        )}
      >
        FC
      </div>
      <div className="leading-tight">
        <p className={cn('font-semibold text-foreground', size === 'sm' ? 'text-sm' : 'text-base')}>
          {appConfig.shortName}
        </p>
        <p className="text-xs text-muted">Panel corporativo</p>
      </div>
    </div>
  );
}

/* —— BackButton —— */
export interface BackButtonProps {
  to?: string;
  label?: string;
}

export function BackButton({ to, label = 'Volver' }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="-ml-2 px-2 text-muted hover:text-foreground"
      onClick={() => (to ? navigate(to) : navigate(-1))}
    >
      <ArrowLeft className="size-4" />
      {label}
    </Button>
  );
}

/* —— SectionWrapper —— */
export function SectionWrapper({ className, ...props }: ComponentProps<'section'>) {
  return <section className={cn('space-y-6', className)} {...props} />;
}

/* —— PageHeader —— */
export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between', className)}>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h1>
        {description ? <p className="max-w-2xl text-sm text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

/* —— AppSidebar —— */
export function AppSidebar() {
  const { sidebarItems } = useRoleNavigation();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border/80 bg-surface/80 backdrop-blur-md lg:flex">
      <div className="border-b border-border/70 px-5 py-5">
        <Logo size="sm" />
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent/15 text-foreground shadow-inner'
                  : 'text-muted hover:bg-surface-elevated hover:text-foreground',
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-border/70 p-4 text-xs text-muted">Forms CUN · v0.1</div>
    </aside>
  );
}

/* —— AppTopbar —— */
export function AppTopbar() {
  const { user, logout } = useAuth();
  const { sidebarItems } = useRoleNavigation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex rounded-lg border border-border/80 p-2 text-muted hover:bg-surface-elevated hover:text-foreground lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            <Menu className="size-5" />
          </button>
          <div>
            <p className="text-sm font-semibold text-foreground">{appConfig.name}</p>
            <p className="text-xs text-muted">Operaciones y solicitudes</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-foreground">{user?.nombre}</p>
            <p className="text-xs text-muted">{user?.correo}</p>
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={() => logout()}>
            <LogOut className="size-4" />
            Salir
          </Button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-border/70 bg-surface px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-1">
            {sidebarItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2 text-sm font-medium',
                    isActive ? 'bg-accent/15 text-foreground' : 'text-muted hover:bg-surface-elevated',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
