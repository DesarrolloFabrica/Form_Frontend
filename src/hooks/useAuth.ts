import { useAuthStore } from '@/store/auth.store';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const hydrateSession = useAuthStore((s) => s.hydrateSession);

  return {
    user,
    role,
    isAuthenticated,
    hasHydrated,
    login,
    logout,
    hydrateSession,
  };
}
