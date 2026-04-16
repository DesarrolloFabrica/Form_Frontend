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
