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

function readPdfFileName(contentDisposition?: string): string {
  if (!contentDisposition) return 'factory_requests.pdf';
  const match = /filename\*?=(?:UTF-8''|")?([^";]+)/i.exec(contentDisposition);
  if (!match?.[1]) return 'factory_requests.pdf';
  try {
    return decodeURIComponent(match[1].trim());
  } catch {
    return match[1].trim();
  }
}

export async function exportFabricaPdf(): Promise<void> {
  const response = await apiClient.get<BlobPart>('/fabrica/export/pdf', {
    responseType: 'blob',
  });
  const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(pdfBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = readPdfFileName(response.headers['content-disposition']);
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
