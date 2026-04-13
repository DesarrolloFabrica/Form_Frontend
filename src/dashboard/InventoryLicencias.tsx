import { createLicencias, createLicenciasBulk, listLicencias } from '@/api/licencias';
import type { LicenciasPayload, LicenciasRecord } from '@/api/types';
import { FormActionBar, FormFieldGrid, FormSection } from '@/components/FormLayout';
import { Button, Input, type SelectOption, Select } from '@/components/UiPrimitives';
import { useEffect, useState, type FormEvent } from 'react';
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

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Usa formato YYYY-MM-DD');

const licenciasSchema = z.object({
  nombreLicencias: z.string().min(1, 'Indica el nombre de la licencia'),
  correoVinculado: z.string().min(1, 'Indica el correo').email('Correo no válido'),
  fechaCompra: dateSchema,
  fechaFinalizacion: dateSchema,
  tipoLicencia: z.string().min(1, 'Selecciona el tipo'),
  coordinacion: z.string().min(1, 'Indica la coordinación responsable'),
  costo: z.coerce.number().min(0, 'El costo debe ser mayor o igual a 0'),
  moneda: z.string().min(1, 'Selecciona la moneda'),
});

type LicenciasFormInput = z.input<typeof licenciasSchema>;
type LicenciasFormErrors = Partial<Record<keyof LicenciasFormInput, string>>;

const emptyLicenciasForm: LicenciasFormInput = {
  nombreLicencias: '',
  correoVinculado: '',
  fechaCompra: '',
  fechaFinalizacion: '',
  tipoLicencia: '',
  coordinacion: '',
  costo: 0,
  moneda: '',
};

function formatCostoString(n: number): string {
  return String(Math.trunc(n));
}

export function InventoryLicencias() {
  const [forms, setForms] = useState<LicenciasFormInput[]>([{ ...emptyLicenciasForm }]);
  const [formErrors, setFormErrors] = useState<LicenciasFormErrors[]>([{}]);
  const [records, setRecords] = useState<LicenciasRecord[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function loadRecords() {
    setLoadingList(true);
    try {
      const rows = await listLicencias();
      setRecords(rows);
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    void loadRecords();
  }, []);

  function onAddForm() {
    setForms((prev) => [...prev, { ...emptyLicenciasForm }]);
    setFormErrors((prev) => [...prev, {}]);
  }

  function onRemoveForm(index: number) {
    if (forms.length === 1) return;
    setForms((prev) => prev.filter((_, current) => current !== index));
    setFormErrors((prev) => prev.filter((_, current) => current !== index));
  }

  function onChange<K extends keyof LicenciasFormInput>(index: number, field: K, value: LicenciasFormInput[K]) {
    setForms((prev) => prev.map((form, current) => (current === index ? { ...form, [field]: value } : form)));
    setFormErrors((prev) =>
      prev.map((blockError, current) =>
        current === index ? { ...blockError, [field]: undefined } : blockError,
      ),
    );
  }

  function normalizePayload(values: LicenciasFormInput): LicenciasPayload {
    return {
      nombreLicencias: values.nombreLicencias.trim(),
      correoVinculado: values.correoVinculado.trim().toLowerCase(),
      fechaCompra: values.fechaCompra,
      fechaFinalizacion: values.fechaFinalizacion,
      tipoLicencia: values.tipoLicencia.trim(),
      coordinacion: values.coordinacion.trim(),
      costo: formatCostoString(Number(values.costo)),
      moneda: values.moneda.trim(),
    };
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: LicenciasFormErrors[] = forms.map(() => ({}));
    const payloads: LicenciasPayload[] = [];

    forms.forEach((form, index) => {
      const parsed = licenciasSchema.safeParse(form);
      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          const key = issue.path[0] as keyof LicenciasFormInput | undefined;
          if (key && !nextErrors[index][key]) {
            nextErrors[index][key] = issue.message;
          }
        }
        return;
      }
      payloads.push(normalizePayload(form));
    });

    setFormErrors(nextErrors);
    if (nextErrors.some((block) => Object.keys(block).length > 0)) {
      toast.error('Revisa los campos obligatorios en los formularios marcados.');
      return;
    }

    setSubmitting(true);
    try {
      if (payloads.length === 1) {
        await createLicencias(payloads[0]);
        toast.success('Registro creado correctamente');
      } else {
        const created = await createLicenciasBulk(payloads);
        toast.success(`Se crearon correctamente ${created.length} registros`);
      }
      setForms([{ ...emptyLicenciasForm }]);
      setFormErrors([{}]);
      await loadRecords();
    } catch {
      /* interceptor */
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-10">
      <form className="space-y-8" onSubmit={onSubmit} noValidate>
        {forms.map((form, index) => (
          <div key={`licencias-form-${index}`} className="space-y-6 rounded-xl border border-border/70 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Formulario {index + 1}</p>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onRemoveForm(index)}
                disabled={forms.length === 1}
              >
                Eliminar
              </Button>
            </div>
            <FormSection>
              <FormFieldGrid>
                <div className="sm:col-span-2">
                  <Input
                    label="Nombre de la licencia"
                    placeholder="Ej. Microsoft 365 E3"
                    error={formErrors[index]?.nombreLicencias}
                    value={form.nombreLicencias}
                    onChange={(event) => onChange(index, 'nombreLicencias', event.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="Correo vinculado"
                    type="email"
                    placeholder="cuenta@cun.edu.co"
                    error={formErrors[index]?.correoVinculado}
                    value={form.correoVinculado}
                    onChange={(event) => onChange(index, 'correoVinculado', event.target.value)}
                  />
                </div>
                <Input
                  label="Fecha de compra"
                  type="date"
                  error={formErrors[index]?.fechaCompra}
                  value={form.fechaCompra}
                  onChange={(event) => onChange(index, 'fechaCompra', event.target.value)}
                />
                <Input
                  label="Fecha de finalización"
                  type="date"
                  error={formErrors[index]?.fechaFinalizacion}
                  value={form.fechaFinalizacion}
                  onChange={(event) => onChange(index, 'fechaFinalizacion', event.target.value)}
                />
                <Select
                  label="Tipo de licencia"
                  placeholder="Selecciona…"
                  options={tipoLicenciaOptions}
                  error={formErrors[index]?.tipoLicencia}
                  value={form.tipoLicencia}
                  onChange={(event) => onChange(index, 'tipoLicencia', event.target.value)}
                />
                <Select
                  label="Coordinación"
                  placeholder="Selecciona…"
                  options={coordinacionOptions}
                  error={formErrors[index]?.coordinacion}
                  value={form.coordinacion}
                  onChange={(event) => onChange(index, 'coordinacion', event.target.value)}
                />
                <Input
                  label="Costo"
                  type="number"
                  min={0}
                  step="0.01"
                  error={formErrors[index]?.costo}
                  value={Number(form.costo)}
                  onChange={(event) => onChange(index, 'costo', Number(event.target.value))}
                />
                <Select
                  label="Moneda"
                  placeholder="Selecciona…"
                  options={monedaOptions}
                  error={formErrors[index]?.moneda}
                  value={form.moneda}
                  onChange={(event) => onChange(index, 'moneda', event.target.value)}
                />
              </FormFieldGrid>
            </FormSection>
          </div>
        ))}

        <FormActionBar>
          <Button type="button" variant="secondary" onClick={onAddForm}>
            + Agregar formulario
          </Button>
          <Button type="submit" isLoading={submitting}>
            {forms.length > 1 ? `Enviar ${forms.length} formularios` : 'Enviar'}
          </Button>
        </FormActionBar>
      </form>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Listado de licencias</h3>
        {loadingList ? <p className="text-sm text-muted">Cargando registros…</p> : null}
        {!loadingList && records.length === 0 ? <p className="text-sm text-muted">Sin registros aún.</p> : null}
        {!loadingList && records.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-border/70">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-surface-elevated text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Licencia</th>
                  <th className="px-3 py-2">Correo</th>
                  <th className="px-3 py-2">Correo creador</th>
                  <th className="px-3 py-2">Moneda</th>
                  <th className="px-3 py-2">Costo</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, index) => (
                  <tr key={`licencias-row-${record.id ?? index}`} className="border-t border-border/60">
                    <td className="px-3 py-2">{record.id ?? '-'}</td>
                    <td className="px-3 py-2">{record.nombreLicencias}</td>
                    <td className="px-3 py-2">{record.correoVinculado}</td>
                    <td className="px-3 py-2">{record.createdByEmail ?? '—'}</td>
                    <td className="px-3 py-2">{record.moneda}</td>
                    <td className="px-3 py-2">{record.costo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
