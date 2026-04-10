import { appConfig } from '@/config/app.config';
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { useRoleNavigation } from '@/hooks/useRoleNavigation';
import { cn } from '@/lib/utils';
import { LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

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
            <p className="text-sm font-medium text-foreground">{user?.displayName}</p>
            <p className="text-xs text-muted">{user?.email}</p>
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
