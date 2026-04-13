import { apiClient } from '@/api/client';
import { AxiosError } from 'axios';

export { apiBaseUrl, apiClient as api } from '@/api/client';

export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
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

function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const fromBody = error.response ? readErrorMessage(error.response.data) : null;
    const msg = fromBody ?? error.message ?? 'Error de red';
    return new ApiError(msg, status);
  }
  if (error instanceof Error) return new ApiError(error.message);
  return new ApiError('Ocurrió un error inesperado.');
}

export async function apiGet<T>(path: string): Promise<T> {
  try {
    const { data } = await apiClient.get<T>(path);
    return data as T;
  } catch (e) {
    throw toApiError(e);
  }
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  try {
    const { data } = await apiClient.post<T>(path, body);
    return data as T;
  } catch (e) {
    throw toApiError(e);
  }
}
