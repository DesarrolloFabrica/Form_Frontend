export function formatIsoDate(value: string | Date | undefined | null): string {
  if (value == null || value === '') return '—';
  const s = typeof value === 'string' ? value : value.toISOString();
  const day = s.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(day)) return day;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toISOString().slice(0, 10);
}

export function formatDateTime(value: string | Date | undefined | null): string {
  if (value == null || value === '') return '—';
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
}
