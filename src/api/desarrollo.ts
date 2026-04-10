import { apiClient, parseRecordList } from '@/api/client';
import type { DesarrolloPayload, DesarrolloRecord } from '@/api/types';

export async function createDesarrollo(payload: DesarrolloPayload): Promise<void> {
  await apiClient.post('/desarrollo', payload);
}

export async function createDesarrolloBulk(payload: DesarrolloPayload[]): Promise<void> {
  await apiClient.post('/desarrollo/bulk', payload);
}

export async function listDesarrollo(): Promise<DesarrolloRecord[]> {
  const { data } = await apiClient.get<unknown>('/desarrollo');
  return parseRecordList<DesarrolloRecord>(data);
}
