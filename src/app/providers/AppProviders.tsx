import { useAuthStore } from '@/store/auth.store';
import { useThemeStore } from '@/store/theme.store';
import { Toaster } from 'sonner';
import { type ReactNode, useEffect, useState } from 'react';

function clearInvalidSession() {
  const s = useAuthStore.getState();
  if (!s.isAuthenticated) return;
  const u = s.user;
  const ok =
    typeof s.accessToken === 'string' &&
    s.accessToken.length > 0 &&
    u &&
    typeof u.id === 'number' &&
    typeof u.nombre === 'string' &&
    typeof u.correo === 'string' &&
    (u.rol === 'fabrica' || u.rol === 'desarrollo');
  if (!ok) {
    s.logout();
  }
}

function ThemedToaster() {
  const theme = useThemeStore((s) => s.theme);
  const [hydrated, setHydrated] = useState(() => useThemeStore.persist.hasHydrated());

  useEffect(() => {
    if (useThemeStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    return useThemeStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  const domDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const sonnerTheme = hydrated ? (theme === 'dark' ? 'dark' : 'light') : domDark ? 'dark' : 'light';

  return <Toaster richColors position="top-right" theme={sonnerTheme} closeButton />;
}

export function AppProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      clearInvalidSession();
      useAuthStore.setState({ hasHydrated: true });
    }
    return useAuthStore.persist.onFinishHydration(() => {
      clearInvalidSession();
      useAuthStore.setState({ hasHydrated: true });
    });
  }, []);

  return (
    <>
      {children}
      <ThemedToaster />
    </>
  );
}
