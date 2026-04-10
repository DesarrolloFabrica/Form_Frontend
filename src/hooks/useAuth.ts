import { useAuthStore } from '@/store/auth.store';
import type { UserRole } from '@/models';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const role = (user?.rol ?? null) as UserRole | null;
  const accessToken = useAuthStore((s) => s.accessToken);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  return {
    user,
    role,
    accessToken,
    isAuthenticated,
    hasHydrated,
    login,
    logout,
  };
}
