import { apiClient, parseRecordList } from '@/api/client';
import type { LicenciasPayload, LicenciasRecord } from '@/api/types';

export async function createLicencias(payload: LicenciasPayload): Promise<void> {
  await apiClient.post('/licencias', payload);
}

export async function createLicenciasBulk(payload: LicenciasPayload[]): Promise<void> {
  await apiClient.post('/licencias/bulk', payload);
}

export async function listLicencias(): Promise<LicenciasRecord[]> {
  const { data } = await apiClient.get<unknown>('/licencias');
  return parseRecordList<LicenciasRecord>(data);
}
