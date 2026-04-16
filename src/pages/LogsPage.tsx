import { listLogs } from '@/api/logs';
import type { LogRecord } from '@/api/types';
import { BackButton, PageHeader, SectionWrapper } from '@/components/AppShell';
import { Button } from '@/components/UiPrimitives';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UiSurfaces';
import { formatDateTime } from '@/lib/formatDate';
import { ROUTES } from '@/utils/routeHelpers';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export function LogsPage() {
  const [rows, setRows] = useState<LogRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listLogs();
      setRows(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Ocurrió un error inesperado.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Logs de actividad';
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <SectionWrapper>
      <BackButton to={ROUTES.DASHBOARD} />
      <PageHeader
        title="Registro de actividad"
        description="Eventos registrados por el sistema (inicios de sesión, altas de registros, etc.)."
      />
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Logs</CardTitle>
            <CardDescription>Datos obtenidos desde el API en tiempo real.</CardDescription>
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={() => void load()} disabled={loading}>
            Actualizar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border border-border/80">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-border/80 bg-surface-elevated/80 text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium">Actor</th>
                  <th className="px-4 py-3 font-medium">Tipo</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-muted">
                      Cargando…
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-muted">
                      No hay registros.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id} className="border-b border-border/60 last:border-0">
                      <td className="px-4 py-3 text-muted">{formatDateTime(r.fechaIngreso)}</td>
                      <td className="px-4 py-3 text-foreground">{r.actor}</td>
                      <td className="px-4 py-3 text-muted">{r.tipo}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </SectionWrapper>
  );
}
