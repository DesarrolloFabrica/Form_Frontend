import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';
import { useRoleNavigation } from '@/hooks/useRoleNavigation';
import { NavLink } from 'react-router-dom';

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
