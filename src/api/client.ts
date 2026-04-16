import { useAuthStore } from '@/store/auth.store';
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

export const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
});

function isLoginRequest(config: InternalAxiosRequestConfig | undefined): boolean {
  const url = config?.url ?? '';
  return url.includes('/auth/login');
}

function readErrorMessage(data: unknown): string | null {
  if (!data || typeof data !== 'object' || !('message' in data)) return null;
  const message = (data as { message: unknown }).message;
  if (typeof message === 'string') return message;
  if (Array.isArray(message)) {
    const merged = message.filter((item): item is string => typeof item === 'string').join('. ');
    return merged || null;
  }
  return null;
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    if (!error.response) {
      toast.error('No fue posible conectar con el servidor.');
      return Promise.reject(error);
    }

    if (isLoginRequest(error.config)) {
      return Promise.reject(error);
    }

    if (status === 401) {
      toast.error('Tu sesión no es válida. Inicia sesión nuevamente.');
      useAuthStore.getState().logout();
      window.location.assign('/login');
      return Promise.reject(error);
    }

    if (status === 403) {
      toast.error('No tienes permisos para esta acción.');
      return Promise.reject(error);
    }

    if (status === 400) {
      const message = readErrorMessage(error.response.data);
      if (message) toast.error(message);
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export function parseRecordList<T>(value: unknown): T[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => item && typeof item === 'object') as T[];
}
