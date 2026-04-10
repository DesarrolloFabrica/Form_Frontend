import { listLogs } from '@/api/logs';
import type { LogRecord } from '@/api/types';
import { SectionWrapper } from '@/components/AppShell';
import { EmptyState } from '@/components/Feedback';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UiSurfaces';
import { ItemGrid } from '@/dashboard/ItemGrid';
import { WelcomeBanner } from '@/dashboard/WelcomeBanner';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useRoleNavigation } from '@/hooks/useRoleNavigation';
import { useCallback, useEffect, useState } from 'react';

function formatLogDate(value: string | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
}

export function DashboardPage() {
  usePageTitle('Panel principal');
  const { dashboardItems } = useRoleNavigation();
  const [logs, setLogs] = useState<LogRecord[]>([]);
  const [logsStatus, setLogsStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');

  const loadLogs = useCallback(async () => {
    setLogsStatus('loading');
    try {
      setLogs((await listLogs()).slice(0, 8));
      setLogsStatus('ok');
    } catch {
      setLogs([]);
      setLogsStatus('error');
    }
  }, []);

  useEffect(() => {
    void loadLogs();
  }, [loadLogs]);

  return (
    <SectionWrapper>
      <WelcomeBanner />
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Tus módulos</h2>
        <p className="text-sm text-muted">Selecciona un inventario para registrar o consultar información.</p>
      </div>
      {dashboardItems.length > 0 ? (
        <ItemGrid items={dashboardItems} />
      ) : (
        <EmptyState
          title="Sin módulos asignados"
          description="Tu rol no tiene vistas de inventario configuradas en esta fase."
        />
      )}

      <Card className="mt-10 border-border/80">
        <CardHeader>
          <CardTitle className="text-base">Actividad reciente (logs)</CardTitle>
          <CardDescription>Últimos eventos registrados en el sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          {logsStatus === 'loading' ? (
            <p className="text-sm text-muted">Cargando logs…</p>
          ) : logsStatus === 'error' ? (
            <p className="text-sm text-muted">No fue posible cargar los logs en este momento.</p>
          ) : logs.length === 0 ? (
            <p className="text-sm text-muted">No hay registros de log para mostrar.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border/60">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead className="border-b border-border/80 bg-surface-elevated/60 text-xs uppercase text-muted">
                  <tr>
                    <th className="px-3 py-2 font-medium">Fecha</th>
                    <th className="px-3 py-2 font-medium">Actor</th>
                    <th className="px-3 py-2 font-medium">Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((row) => (
                    <tr key={row.id ?? `${row.actor}-${row.fechaIngreso}`} className="border-b border-border/50 last:border-0">
                      <td className="px-3 py-2 text-muted">{formatLogDate(row.fechaIngreso)}</td>
                      <td className="px-3 py-2 text-foreground">{row.actor ?? '—'}</td>
                      <td className="px-3 py-2 text-muted">{row.tipo ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </SectionWrapper>
  );
}
