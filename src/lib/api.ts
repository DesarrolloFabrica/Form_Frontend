import { useAuthStore } from '@/store/auth.store';
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

export const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: apiBaseUrl,
});

function isAuthLoginRequest(config: InternalAxiosRequestConfig | undefined): boolean {
  const url = config?.url ?? '';
  return url.includes('auth/login');
}

function nestMessage(data: unknown): string | null {
  if (data && typeof data === 'object' && 'message' in data) {
    const m = (data as { message: unknown }).message;
    if (typeof m === 'string') return m;
    if (Array.isArray(m)) return m.filter((x): x is string => typeof x === 'string').join('. ');
  }
  return null;
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const config = error.config;
    const status = error.response?.status;

    if (!error.response) {
      toast.error('No fue posible conectar con el servidor.');
      return Promise.reject(error);
    }

    if (isAuthLoginRequest(config)) {
      return Promise.reject(error);
    }

    if (status === 401) {
      toast.error('Tu sesión expiró. Inicia sesión nuevamente.');
      useAuthStore.getState().logout();
      window.location.assign('/login');
      return Promise.reject(error);
    }

    if (status === 403) {
      toast.error('No tienes permisos para esta acción');
      return Promise.reject(error);
    }

    if (status === 500) {
      toast.error('Ocurrió un error interno. Intenta nuevamente.');
      return Promise.reject(error);
    }

    if (status === 400) {
      const msg = nestMessage(error.response.data);
      if (msg) toast.error(msg);
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);
