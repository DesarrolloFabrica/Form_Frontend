import { apiClient, parseRecordList } from '@/api/client';
import type { FabricaPayload, FabricaRecord } from '@/api/types';

function parseRecord(value: unknown): FabricaRecord {
  return value && typeof value === 'object' ? (value as FabricaRecord) : ({} as FabricaRecord);
}

export async function createFabrica(payload: FabricaPayload): Promise<FabricaRecord> {
  const { data } = await apiClient.post<unknown>('/fabrica', payload);
  return parseRecord(data);
}

export async function createFabricaBulk(payload: FabricaPayload[]): Promise<FabricaRecord[]> {
  const { data } = await apiClient.post<unknown>('/fabrica/bulk', payload);
  return parseRecordList<FabricaRecord>(data);
}

export async function listFabrica(): Promise<FabricaRecord[]> {
  const { data } = await apiClient.get<unknown>('/fabrica');
  return parseRecordList<FabricaRecord>(data);
}
