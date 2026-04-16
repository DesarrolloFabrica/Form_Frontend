/** Base URL del API Nest (incluye prefijo `/api` si el backend lo usa). Definida en `VITE_API_URL`. */
export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL;
  if (raw !== undefined && String(raw).trim() !== '') {
    return String(raw).replace(/\/$/, '');
  }
  if (import.meta.env.DEV) {
    return 'http://localhost:3000/api';
  }
  return '';
}
