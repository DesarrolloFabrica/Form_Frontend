import { apiClient, parseRecordList } from '@/api/client';
import type { FabricaPayload, FabricaRecord } from '@/api/types';

export async function createFabrica(payload: FabricaPayload): Promise<void> {
  await apiClient.post('/fabrica', payload);
}

export async function createFabricaBulk(payload: FabricaPayload[]): Promise<void> {
  await apiClient.post('/fabrica/bulk', payload);
}

export async function listFabrica(): Promise<FabricaRecord[]> {
  const { data } = await apiClient.get<unknown>('/fabrica');
  return parseRecordList<FabricaRecord>(data);
}
