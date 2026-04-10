import { useAuthStore } from '@/store/auth.store';
import { Toaster } from 'sonner';
import { type ReactNode, useEffect } from 'react';

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
      <Toaster richColors position="top-right" theme="dark" closeButton />
    </>
  );
}
