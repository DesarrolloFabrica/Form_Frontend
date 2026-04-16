import { apiClient, parseRecordList } from '@/api/client';
import type { LicenciasPayload, LicenciasRecord } from '@/api/types';

function parseRecord(value: unknown): LicenciasRecord {
  return value && typeof value === 'object' ? (value as LicenciasRecord) : ({} as LicenciasRecord);
}

export async function createLicencias(payload: LicenciasPayload): Promise<LicenciasRecord> {
  const { data } = await apiClient.post<unknown>('/licencias', payload);
  return parseRecord(data);
}

export async function createLicenciasBulk(payload: LicenciasPayload[]): Promise<LicenciasRecord[]> {
  const { data } = await apiClient.post<unknown>('/licencias/bulk', payload);
  return parseRecordList<LicenciasRecord>(data);
}

export async function listLicencias(): Promise<LicenciasRecord[]> {
  const { data } = await apiClient.get<unknown>('/licencias');
  return parseRecordList<LicenciasRecord>(data);
}
