import {
  authStorageKey,
  desarrolloEmailSubstring,
  explicitDesarrolloEmails,
  explicitFabricaEmails,
  fabricaEmailSubstring,
  loginEnabledRoles,
} from '@/config/auth.config';
import type { AuthUser, UserRole } from '@/models';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const AUTH_DELAY_MS = 450;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function resolveUserRoleFromEmail(email: string): UserRole | null {
  const normalized = normalizeEmail(email);

  if (explicitFabricaEmails.some((e) => normalizeEmail(e) === normalized)) {
    return loginEnabledRoles.includes('FABRICA_COORDINADOR') ? 'FABRICA_COORDINADOR' : null;
  }
  if (explicitDesarrolloEmails.some((e) => normalizeEmail(e) === normalized)) {
    return loginEnabledRoles.includes('DESARROLLO') ? 'DESARROLLO' : null;
  }

  if (normalized.includes(fabricaEmailSubstring.toLowerCase())) {
    return 'FABRICA_COORDINADOR';
  }
  if (normalized.includes(desarrolloEmailSubstring.toLowerCase())) {
    return 'DESARROLLO';
  }

  return null;
}

function buildMockUserFromEmail(email: string): AuthUser {
  const local = email.split('@')[0] ?? 'usuario';
  const displayName = local
    .split(/[._-]/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(' ');

  return {
    id: `mock-${local}`,
    email: email.trim().toLowerCase(),
    displayName: displayName || 'Usuario',
  };
}

export interface AuthState {
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setSession: (user: AuthUser, role: UserRole) => void;
  hydrateSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      isAuthenticated: false,
      hasHydrated: false,

      setSession: (user, role) => {
        set({ user, role, isAuthenticated: true });
      },

      login: async (email, password) => {
        void password;
        await new Promise((r) => setTimeout(r, AUTH_DELAY_MS));
        const role = resolveUserRoleFromEmail(email);
        if (!role) {
          throw new Error('El correo no pertenece a un grupo autorizado.');
        }
        const user = buildMockUserFromEmail(email);
        set({ user, role, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, role: null, isAuthenticated: false });
      },

      hydrateSession: () => {
        queueMicrotask(() => {
          void useAuthStore.persist.rehydrate();
        });
      },
    }),
    {
      name: authStorageKey,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
