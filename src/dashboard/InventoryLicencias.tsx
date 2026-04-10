import { FormActionBar, FormFieldGrid, FormSection } from '@/components/FormLayout';
import { Button, Input, type SelectOption, Select } from '@/components/UiPrimitives';
import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const tipoLicenciaOptions: SelectOption[] = [
  { value: 'Anual', label: 'Anual' },
  { value: 'SaaS', label: 'SaaS' },
  { value: 'Perpetua', label: 'Perpetua' },
  { value: 'Suscripción', label: 'Suscripción' },
];

const monedaOptions: SelectOption[] = [
  { value: 'COP', label: 'COP · Peso colombiano' },
  { value: 'USD', label: 'USD · Dólar' },
  { value: 'EUR', label: 'EUR · Euro' },
];

const coordinacionOptions: SelectOption[] = [
  { value: 'TI', label: 'TI' },
  { value: 'Fábrica', label: 'Fábrica' },
  { value: 'Desarrollo', label: 'Desarrollo' },
  { value: 'Financiera', label: 'Financiera' },
];

const licenciasSchema = z.object({
  nombreLicencias: z.string().min(1, 'Indica el nombre de la licencia'),
  correoVinculado: z.string().min(1, 'Indica el correo').email('Correo no válido'),
  fechaCompra: z.string().min(1, 'Indica la fecha de compra'),
  fechaFinalizacion: z.string().min(1, 'Indica la fecha de finalización'),
  tipoLicencia: z.string().min(1, 'Selecciona el tipo'),
  coordinacion: z.string().min(1, 'Indica la coordinación responsable'),
  costo: z.coerce.number().min(0, 'El costo debe ser mayor o igual a 0'),
  moneda: z.string().min(1, 'Selecciona la moneda'),
});

type LicenciasFormInput = z.input<typeof licenciasSchema>;

const defaultValues: LicenciasFormInput = {
  nombreLicencias: '',
  correoVinculado: '',
  fechaCompra: '',
  fechaFinalizacion: '',
  tipoLicencia: '',
  coordinacion: '',
  costo: 0,
  moneda: '',
};

type LicenciaRow = {
  id?: number;
  nombreLicencias?: string;
  correoVinculado?: string;
  fechaCompra?: string;
  fechaFinalizacion?: string;
  tipoLicencia?: string;
  coordinacion?: string;
  costo?: string;
  moneda?: string;
};

function parseList(data: unknown): LicenciaRow[] {
  if (!Array.isArray(data)) return [];
  return data.filter((x) => x && typeof x === 'object') as LicenciaRow[];
}

function formatCostoString(n: number): string {
  return n.toFixed(2);
}

export function InventoryLicencias() {
  const [savingDraft, setSavingDraft] = useState(false);
  const [rows, setRows] = useState<LicenciaRow[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const loadList = useCallback(async () => {
    setListError(null);
    setListLoading(true);
    try {
      const { data } = await api.get<unknown>('/licencias');
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
  } = useForm<LicenciasFormInput>({
    resolver: zodResolver(licenciasSchema),
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
    const body = {
      nombreLicencias: values.nombreLicencias.trim(),
      correoVinculado: values.correoVinculado.trim().toLowerCase(),
      fechaCompra: values.fechaCompra,
      fechaFinalizacion: values.fechaFinalizacion,
      tipoLicencia: values.tipoLicencia.trim(),
      coordinacion: values.coordinacion.trim(),
      costo: formatCostoString(values.costo),
      moneda: values.moneda.trim(),
    };

    try {
      await api.post('/licencias', body);
      toast.success('Registro creado correctamente.');
      reset(defaultValues);
      await loadList();
    } catch {
      /* interceptor */
    }
  });

  return (
    <div className="space-y-10">
      <form className="space-y-8" onSubmit={onValidSubmit} noValidate>
        <FormSection>
          <FormFieldGrid>
            <div className="sm:col-span-2">
              <Input
                label="Nombre de la licencia"
                placeholder="Ej. Microsoft 365 E3"
                error={errors.nombreLicencias?.message}
                {...register('nombreLicencias')}
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Correo vinculado"
                type="email"
                placeholder="cuenta@cun.edu.co"
                error={errors.correoVinculado?.message}
                {...register('correoVinculado')}
              />
            </div>
            <Input
              label="Fecha de compra"
              type="date"
              error={errors.fechaCompra?.message}
              {...register('fechaCompra')}
            />
            <Input
              label="Fecha de finalización"
              type="date"
              error={errors.fechaFinalizacion?.message}
              {...register('fechaFinalizacion')}
            />
            <Select
              label="Tipo de licencia"
              placeholder="Selecciona…"
              options={tipoLicenciaOptions}
              error={errors.tipoLicencia?.message}
              {...register('tipoLicencia')}
            />
            <Select
              label="Coordinación"
              placeholder="Selecciona…"
              options={coordinacionOptions}
              error={errors.coordinacion?.message}
              {...register('coordinacion')}
            />
            <Input
              label="Costo"
              type="number"
              min={0}
              step="0.01"
              error={errors.costo?.message}
              {...register('costo', { valueAsNumber: true })}
            />
            <Select
              label="Moneda"
              placeholder="Selecciona…"
              options={monedaOptions}
              error={errors.moneda?.message}
              {...register('moneda')}
            />
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
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b border-border/80 bg-surface-elevated/80 text-xs uppercase text-muted">
                <tr>
                  <th className="px-3 py-2 font-medium">Nombre</th>
                  <th className="px-3 py-2 font-medium">Correo</th>
                  <th className="px-3 py-2 font-medium">Compra</th>
                  <th className="px-3 py-2 font-medium">Finalización</th>
                  <th className="px-3 py-2 font-medium">Tipo</th>
                  <th className="px-3 py-2 font-medium">Coordinación</th>
                  <th className="px-3 py-2 font-medium">Costo</th>
                  <th className="px-3 py-2 font-medium">Moneda</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id ?? `${r.nombreLicencias}-${r.correoVinculado}`} className="border-b border-border/60 last:border-0">
                    <td className="px-3 py-2 text-foreground">{r.nombreLicencias ?? '—'}</td>
                    <td className="px-3 py-2 text-muted">{r.correoVinculado ?? '—'}</td>
                    <td className="px-3 py-2 text-muted">{r.fechaCompra ?? '—'}</td>
                    <td className="px-3 py-2 text-muted">{r.fechaFinalizacion ?? '—'}</td>
                    <td className="px-3 py-2 text-muted">{r.tipoLicencia ?? '—'}</td>
                    <td className="px-3 py-2 text-muted">{r.coordinacion ?? '—'}</td>
                    <td className="px-3 py-2 text-muted">{r.costo ?? '—'}</td>
                    <td className="px-3 py-2 text-muted">{r.moneda ?? '—'}</td>
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
