import { appConfig } from '@/config/app.config';
import type { SidebarNavConfig } from '@/config/navigation.config';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/UiPrimitives';
import { useAuth } from '@/hooks/useAuth';
import { useRoleNavigation } from '@/hooks/useRoleNavigation';
import { cn } from '@/lib/utils';
import { ArrowLeft, ChevronDown, LogOut, Menu } from 'lucide-react';
import { type ComponentProps, type ReactNode, useEffect, useId, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

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
          'flex shrink-0 items-center justify-center rounded-xl bg-[#071a2e] px-2 py-1.5 ring-1 ring-sky-950/50',
          size === 'sm' ? 'h-8' : 'h-11',
        )}
      >
        <img
          src="/Logosinfondo.png"
          alt={`${appConfig.shortName} logo`}
          width={size === 'sm' ? 32 : 40}
          height={size === 'sm' ? 32 : 40}
          className={cn('w-auto object-contain', size === 'sm' ? 'max-h-5' : 'max-h-7')}
        />
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

function sidebarNavLinkClass(isActive: boolean, nested?: boolean) {
  return cn(
    'block rounded-lg text-sm font-medium transition-all duration-200',
    nested ? 'px-3 py-2' : 'px-3 py-2.5',
    isActive
      ? 'bg-accent/15 text-foreground shadow-[inset_0_1px_0_0_rgb(255_255_255/0.06)] ring-1 ring-accent/25 dark:shadow-[inset_0_2px_6px_rgb(0_0_0/0.35)] dark:ring-accent/20'
      : 'text-muted hover:bg-surface-elevated/80 hover:text-foreground',
  );
}

function SidebarNavigation({
  config,
  onItemClick,
}: {
  config: SidebarNavConfig | null;
  onItemClick?: () => void;
}) {
  const location = useLocation();
  const groupId = useId();
  const formularioActive =
    config?.formulario.some((item) => location.pathname === item.href) ?? false;
  const [formularioOpen, setFormularioOpen] = useState(formularioActive);

  useEffect(() => {
    if (formularioActive) setFormularioOpen(true);
  }, [formularioActive]);

  if (!config) return null;

  return (
    <div className="flex flex-col gap-1">
      <NavLink
        to={config.panel.href}
        onClick={onItemClick}
        className={({ isActive }) => sidebarNavLinkClass(isActive)}
      >
        {config.panel.label}
      </NavLink>

      <div className="pt-1">
        <button
          type="button"
          id={`${groupId}-trigger`}
          aria-expanded={formularioOpen}
          aria-controls={`${groupId}-panel`}
          onClick={() => setFormularioOpen((open) => !open)}
          className={cn(
            'flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted transition-colors',
            'hover:bg-surface-elevated hover:text-foreground',
            formularioOpen && 'text-foreground',
          )}
        >
          Formulario
          <ChevronDown
            className={cn('size-4 shrink-0 opacity-70 transition-transform', formularioOpen && 'rotate-180')}
            aria-hidden
          />
        </button>
        {formularioOpen ? (
          <div
            id={`${groupId}-panel`}
            role="region"
            aria-labelledby={`${groupId}-trigger`}
            className="mt-1 space-y-0.5 border-l border-border/60 py-0.5 pl-3 ml-3"
          >
            {config.formulario.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={onItemClick}
                className={({ isActive }) => sidebarNavLinkClass(isActive, true)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* —— AppSidebar —— */
export function AppSidebar() {
  const { sidebarNav } = useRoleNavigation();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border/60 bg-surface/75 shadow-[4px_0_32px_-12px_rgb(15_23_42/0.12)] backdrop-blur-xl dark:bg-surface/65 dark:shadow-[4px_0_40px_-8px_rgb(0_0_0/0.5)] lg:flex">
      <div className="border-b border-border/60 px-5 py-5">
        <Logo size="sm" />
      </div>
      <nav className="flex flex-1 flex-col p-3">
        <SidebarNavigation config={sidebarNav} />
      </nav>
      <div className="border-t border-border/60 p-4 text-xs text-muted/90">Forms CUN · v0.1</div>
    </aside>
  );
}

/* —— AppTopbar —— */
export function AppTopbar() {
  const { user, logout } = useAuth();
  const { sidebarNav } = useRoleNavigation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/75 shadow-sm shadow-slate-900/4 backdrop-blur-xl dark:bg-background/65 dark:shadow-black/25">
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
          <ThemeToggle />
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
        <div className="border-t border-border/60 bg-surface/95 px-4 py-3 shadow-lg shadow-slate-900/8 backdrop-blur-xl dark:bg-surface/90 dark:shadow-black/30 lg:hidden">
          <SidebarNavigation config={sidebarNav} onItemClick={() => setOpen(false)} />
        </div>
      ) : null}
    </header>
  );
}
