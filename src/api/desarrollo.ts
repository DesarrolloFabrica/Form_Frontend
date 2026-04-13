import { apiClient, parseRecordList } from '@/api/client';
import type { DesarrolloPayload, DesarrolloRecord } from '@/api/types';

function parseRecord(value: unknown): DesarrolloRecord {
  return value && typeof value === 'object' ? (value as DesarrolloRecord) : ({} as DesarrolloRecord);
}

export async function createDesarrollo(payload: DesarrolloPayload): Promise<DesarrolloRecord> {
  const { data } = await apiClient.post<unknown>('/desarrollo', payload);
  return parseRecord(data);
}

export async function createDesarrolloBulk(payload: DesarrolloPayload[]): Promise<DesarrolloRecord[]> {
  const { data } = await apiClient.post<unknown>('/desarrollo/bulk', payload);
  return parseRecordList<DesarrolloRecord>(data);
}

export async function listDesarrollo(): Promise<DesarrolloRecord[]> {
  const { data } = await apiClient.get<unknown>('/desarrollo');
  return parseRecordList<DesarrolloRecord>(data);
}
