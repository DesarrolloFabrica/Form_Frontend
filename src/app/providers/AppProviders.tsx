import { useAuthStore } from '@/store/auth.store';
import { Toaster } from 'sonner';
import { type ReactNode, useEffect } from 'react';

export function AppProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      useAuthStore.setState({ hasHydrated: true });
    }
    return useAuthStore.persist.onFinishHydration(() => {
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
