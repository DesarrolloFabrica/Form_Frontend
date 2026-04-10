import { cn } from '@/lib/utils';
import { useThemeStore } from '@/store/theme.store';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

function domIsDark(): boolean {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
}

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const [themeHydrated, setThemeHydrated] = useState(() => useThemeStore.persist.hasHydrated());

  useEffect(() => {
    if (useThemeStore.persist.hasHydrated()) {
      setThemeHydrated(true);
      return;
    }
    return useThemeStore.persist.onFinishHydration(() => setThemeHydrated(true));
  }, []);

  const isDark = themeHydrated ? theme === 'dark' : domIsDark();

  return (
    <button
      type="button"
      onClick={() => toggleTheme()}
      className={cn(
        'inline-flex rounded-lg border border-border/80 p-2 text-muted transition-colors hover:bg-surface-elevated hover:text-foreground',
        className,
      )}
      aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
    >
      {isDark ? <Sun className="size-5" aria-hidden /> : <Moon className="size-5" aria-hidden />}
    </button>
  );
}
