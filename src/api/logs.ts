import { apiClient, parseRecordList } from '@/api/client';
import type { LogRecord } from '@/api/types';

export async function listLogs(): Promise<LogRecord[]> {
  const { data } = await apiClient.get<unknown>('/logs');
  return parseRecordList<LogRecord>(data);
}
