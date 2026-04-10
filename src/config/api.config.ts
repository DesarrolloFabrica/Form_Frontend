/** Base URL del API Nest (incluye prefijo `/api`). Por defecto `/api` vía proxy de Vite. */
export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL;
  if (raw !== undefined && String(raw).trim() !== '') {
    return String(raw).replace(/\/$/, '');
  }
  return '/api';
}
