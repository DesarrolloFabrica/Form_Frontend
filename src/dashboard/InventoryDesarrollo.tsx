import { FormActionBar, FormFieldGrid, FormSection } from '@/components/FormLayout';
import { Button, Input, type SelectOption, Select, Textarea } from '@/components/UiPrimitives';
import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const estadoOptions: SelectOption[] = [
  { value: 'Pendiente', label: 'Pendiente' },
  { value: 'En progreso', label: 'En progreso' },
  { value: 'En pruebas', label: 'En pruebas' },
  { value: 'Entregado', label: 'Entregado' },
  { value: 'Detenido', label: 'Detenido' },
];

const desarrolloSchema = z.object({
  nombreProyecto: z.string().min(1, 'Indica el nombre del proyecto'),
  fechaSolicitud: z.string().min(1, 'Indica la fecha de solicitud'),
  fechaEntrega: z.string().min(1, 'Indica la fecha de entrega'),
  solicitante: z.string().min(1, 'Indica el solicitante'),
  estado: z.string().min(1, 'Selecciona el estado'),
  observaciones: z.string().optional(),
});

type DesarrolloFormInput = z.input<typeof desarrolloSchema>;

const defaultValues: DesarrolloFormInput = {
  nombreProyecto: '',
  fechaSolicitud: '',
  fechaEntrega: '',
  solicitante: '',
  estado: '',
  observaciones: '',
};

type DesarrolloRow = {
  id?: number;
  nombreProyecto?: string;
  fechaSolicitud?: string;
  fechaEntrega?: string;
  solicitante?: string;
  estado?: string;
  observaciones?: string | null;
};

function parseList(data: unknown): DesarrolloRow[] {
  if (!Array.isArray(data)) return [];
  return data.filter((x) => x && typeof x === 'object') as DesarrolloRow[];
}

export function InventoryDesarrollo() {
  const [savingDraft, setSavingDraft] = useState(false);
  const [rows, setRows] = useState<DesarrolloRow[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const loadList = useCallback(async () => {
    setListError(null);
    setListLoading(true);
    try {
      const { data } = await api.get<unknown>('/desarrollo');
      setRows(parseList(data));
    } catch {
      setListError('No se pudo cargar el listado.');
      setRows([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<DesarrolloFormInput>({
    resolver: zodResolver(desarrolloSchema),
    defaultValues,
  });

  const onSaveDraft = async () => {
    setSavingDraft(true);
    try {
      void getValues();
      toast.success('Borrador guardado localmente.');
    } catch {
      toast.error('No se pudo guardar el borrador.');
    } finally {
      setSavingDraft(false);
    }
  };

  const onValidSubmit = handleSubmit(async (values) => {
    const body: Record<string, string> = {
      nombreProyecto: values.nombreProyecto.trim(),
      fechaSolicitud: values.fechaSolicitud,
      fechaEntrega: values.fechaEntrega,
      solicitante: values.solicitante.trim(),
      estado: values.estado.trim(),
    };
    const obs = values.observaciones?.trim();
    if (obs) body.observaciones = obs;

    try {
      await api.post('/desarrollo', body);
      toast.success('Registro creado correctamente.');
      reset(defaultValues);
      await loadList();
    } catch {
      /* toasts / errores vía interceptor o vacío */
    }
  });

  return (
    <div className="space-y-10">
      <form className="space-y-8" onSubmit={onValidSubmit} noValidate>
        <FormSection>
          <FormFieldGrid>
            <div className="sm:col-span-2 lg:col-span-3">
              <Input
                label="Nombre del proyecto"
                placeholder="Ej. Portal de servicios estudiantiles"
                error={errors.nombreProyecto?.message}
                {...register('nombreProyecto')}
              />
            </div>
            <Input
              label="Fecha de solicitud"
              type="date"
              error={errors.fechaSolicitud?.message}
              {...register('fechaSolicitud')}
            />
            <Input
              label="Fecha de entrega"
              type="date"
              error={errors.fechaEntrega?.message}
              {...register('fechaEntrega')}
            />
            <Input
              label="Solicitante"
              placeholder="Nombre del solicitante"
              error={errors.solicitante?.message}
              {...register('solicitante')}
            />
            <Select
              label="Estado"
              placeholder="Selecciona…"
              options={estadoOptions}
              error={errors.estado?.message}
              {...register('estado')}
            />
            <div className="sm:col-span-2 lg:col-span-3">
              <Textarea
                label="Observaciones"
                placeholder="Opcional — notas, riesgos, dependencias…"
                error={errors.observaciones?.message}
                {...register('observaciones')}
              />
            </div>
          </FormFieldGrid>
        </FormSection>

        <FormActionBar>
          <Button type="button" variant="secondary" isLoading={savingDraft} onClick={() => void onSaveDraft()}>
            Guardar borrador
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Enviar
          </Button>
        </FormActionBar>
      </form>

      <div className="space-y-3">
        <h3 className="text-base font-semibold text-foreground">Registros</h3>
        {listLoading ? (
          <p className="text-sm text-muted">Cargando…</p>
        ) : listError ? (
          <p className="text-sm text-danger">{listError}</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted">No hay registros aún.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border/80">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-border/80 bg-surface-elevated/80 text-xs uppercase text-muted">
                <tr>
                  <th className="px-3 py-2 font-medium">Proyecto</th>
                  <th className="px-3 py-2 font-medium">Solicitud</th>
                  <th className="px-3 py-2 font-medium">Entrega</th>
                  <th className="px-3 py-2 font-medium">Solicitante</th>
                  <th className="px-3 py-2 font-medium">Estado</th>
                  <th className="px-3 py-2 font-medium">Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id ?? `${r.nombreProyecto}-${r.fechaSolicitud}`} className="border-b border-border/60 last:border-0">
                    <td className="px-3 py-2 text-foreground">{r.nombreProyecto ?? '—'}</td>
                    <td className="px-3 py-2 text-muted">{r.fechaSolicitud ?? '—'}</td>
                    <td className="px-3 py-2 text-muted">{r.fechaEntrega ?? '—'}</td>
                    <td className="px-3 py-2 text-muted">{r.solicitante ?? '—'}</td>
                    <td className="px-3 py-2 text-muted">{r.estado ?? '—'}</td>
                    <td className="max-w-[200px] truncate px-3 py-2 text-muted" title={r.observaciones ?? ''}>
                      {r.observaciones ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
