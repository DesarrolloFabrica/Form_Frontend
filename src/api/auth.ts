import { apiClient } from '@/api/client';
import type { AuthLoginRequest, AuthLoginResponse, AuthRegisterRequest } from '@/api/types';
import type { AuthUser, UserRole } from '@/models';

function isUserRole(value: unknown): value is UserRole {
  return value === 'fabrica' || value === 'desarrollo';
}

function parseAuthUser(raw: unknown): AuthUser | null {
  if (!raw || typeof raw !== 'object') return null;
  const user = raw as Record<string, unknown>;
  if (
    typeof user.id !== 'number' ||
    !Number.isFinite(user.id) ||
    typeof user.nombre !== 'string' ||
    typeof user.correo !== 'string' ||
    !isUserRole(user.rol)
  ) {
    return null;
  }
  return {
    id: user.id,
    nombre: user.nombre,
    correo: user.correo,
    rol: user.rol,
  };
}

export async function login(payload: AuthLoginRequest): Promise<AuthLoginResponse> {
  const { data } = await apiClient.post<{ accessToken: unknown; user: unknown }>('/auth/login', payload);
  const user = parseAuthUser(data.user);
  if (!user || typeof data.accessToken !== 'string' || data.accessToken.length === 0) {
    throw new Error('Respuesta de inicio de sesión no válida.');
  }
  return {
    accessToken: data.accessToken,
    user,
  };
}

export async function register(payload: AuthRegisterRequest): Promise<void> {
  await apiClient.post('/auth/register', payload);
}
