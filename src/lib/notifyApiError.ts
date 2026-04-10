import { ApiError } from '@/lib/api';
import { toast } from 'sonner';

export function notifyApiError(error: unknown): void {
  if (error instanceof ApiError) {
    toast.error(error.message);
    return;
  }
  if (error instanceof Error) {
    toast.error(error.message);
    return;
  }
  toast.error('Ocurrió un error inesperado.');
}
