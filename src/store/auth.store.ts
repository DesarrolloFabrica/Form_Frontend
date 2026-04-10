import type { AuthUser } from '@/models';
import { login as loginRequest } from '@/api/auth';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const AUTH_STORAGE_KEY = 'forms-cun-auth';

export interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  login: (correo: string, contrasena: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      hasHydrated: false,

      login: async (correo, contrasena) => {
        const data = await loginRequest({ correo: correo.trim(), contrasena });

        set({
          accessToken: data.accessToken,
          user: data.user,
          isAuthenticated: true,
        });
      },

      logout: () => {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
