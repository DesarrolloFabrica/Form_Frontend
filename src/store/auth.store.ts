import type { AuthUser, UserRole } from '@/models';
import axios from 'axios';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const AUTH_STORAGE_KEY = 'forms-cun-auth';

const loginBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

function isUserRole(value: unknown): value is UserRole {
  return value === 'fabrica' || value === 'desarrollo';
}

function parseAuthUser(raw: unknown): AuthUser | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  let idNum: number | null = null;
  if (typeof o.id === 'number' && Number.isFinite(o.id)) idNum = o.id;
  else if (typeof o.id === 'string' && /^\d+$/.test(o.id)) idNum = Number(o.id);
  const nombre = o.nombre;
  const correo = o.correo;
  const rol = o.rol;
  if (idNum === null || typeof nombre !== 'string' || typeof correo !== 'string' || !isUserRole(rol)) {
    return null;
  }
  return { id: idNum, nombre, correo, rol };
}

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
        const { data } = await axios.post<{
          accessToken: string;
          user: unknown;
        }>(`${loginBaseUrl}/auth/login`, { correo: correo.trim(), contrasena });

        const user = parseAuthUser(data.user);
        if (!user || typeof data.accessToken !== 'string') {
          throw new Error('Respuesta de inicio de sesión no válida.');
        }

        set({
          accessToken: data.accessToken,
          user,
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
