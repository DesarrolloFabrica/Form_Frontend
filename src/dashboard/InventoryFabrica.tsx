import { createFabrica, createFabricaBulk, listFabrica } from '@/api/fabrica';
import type { FabricaPayload, FabricaRecord } from '@/api/types';
import { FormActionBar, FormFieldGrid, FormSection, FormSectionTitle } from '@/components/FormLayout';
import { Button, Input, type SelectOption, Select, Textarea } from '@/components/UiPrimitives';
import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const tipoRequisicionOptions: SelectOption[] = [
  { value: 'Nueva', label: 'Nueva' },
  { value: 'Materiales', label: 'Materiales' },
  { value: 'Insumos', label: 'Insumos' },
  { value: 'Equipo', label: 'Equipo' },
];

const entregaInsumoOptions: SelectOption[] = [
  { value: 'Pendiente', label: 'Pendiente' },
  { value: 'Entregado', label: 'Entregado' },
  { value: 'En curso', label: 'En curso' },
];

const tipoPaqueteOptions: SelectOption[] = [
  { value: 'SCORM', label: 'SCORM' },
  { value: 'Notebook', label: 'Notebook' },
];

const canalSolicitudOptions: SelectOption[] = [
  { value: 'Web', label: 'Web' },
  { value: 'Correo', label: 'Correo' },
  { value: 'CUN 360', label: 'CUN 360' },
  { value: 'Meet', label: 'Meet' },
  { value: 'Acta', label: 'Acta' },
];

const estadoFabricaOptions: SelectOption[] = [
  { value: 'Abierto', label: 'Abierto' },
  { value: 'En revisión', label: 'En revisión' },
  { value: 'Aprobado', label: 'Aprobado' },
  { value: 'Entregado', label: 'Entregado' },
];

const tipoProgresoOptions: SelectOption[] = [
  { value: 'Inicial', label: 'Inicial' },
  { value: 'En curso', label: 'En curso' },
  { value: 'Cerrado', label: 'Cerrado' },
];

const modalidadOptions: SelectOption[] = [
  { value: 'Presencial', label: 'Presencial' },
  { value: 'Virtual', label: 'Virtual' },
  { value: 'Dual', label: 'Dual' },
];

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Usa formato YYYY-MM-DD');

const fabricaSchema = z.object({
  tipoRequisicion: z.string().min(1, 'Selecciona o indica el tipo de requisición'),
  cantidadModulos: z.coerce.number().min(0, 'Debe ser mayor o igual a 0'),
  cantidadGranulos: z.coerce.number().min(0, 'Debe ser mayor o igual a 0'),
  materiales: z.string().min(1, 'Describe los materiales'),
  cantidadMateriales: z.coerce.number().min(0, 'Debe ser mayor o igual a 0'),
  fechaSolicitudOt: dateSchema,
  solicitante: z.string().min(1, 'Indica el solicitante'),
  fechaEntrega: dateSchema,
  entregaInsumo: z.string().min(1, 'Indica la entrega de insumo'),
  enlaceInsumo: z
    .string()
    .refine(
      (val) => val.trim() === '' || z.string().url().safeParse(val.trim()).success,
      'Debe ser una URL válida',
    ),
  tipoPaquete: z.string().min(1, 'Indica el tipo de paquete'),
  canalSolicitud: z.string().min(1, 'Selecciona el canal'),
  estado: z.string().min(1, 'Selecciona el estado'),
  tipoProgreso: z.string().min(1, 'Indica el tipo de progreso'),
  escuela: z.string().min(1, 'Indica la escuela'),
  programa: z.string().min(1, 'Indica el programa'),
  modalidad: z.string().min(1, 'Selecciona la modalidad'),
  cantidadMaterias: z.coerce.number().min(0, 'Debe ser mayor o igual a 0'),
});

type FabricaFormInput = z.input<typeof fabricaSchema>;

type FabricaFormErrors = Partial<Record<keyof FabricaFormInput, string>>;

const emptyFabricaForm: FabricaFormInput = {
  tipoRequisicion: '',
  cantidadModulos: 0,
  cantidadGranulos: 0,
  materiales: '',
  cantidadMateriales: 0,
  fechaSolicitudOt: '',
  solicitante: '',
  fechaEntrega: '',
  entregaInsumo: '',
  enlaceInsumo: '',
  tipoPaquete: '',
  canalSolicitud: '',
  estado: '',
  tipoProgreso: '',
  escuela: '',
  programa: '',
  modalidad: '',
  cantidadMaterias: 0,
};

export function InventoryFabrica() {
  const [forms, setForms] = useState<FabricaFormInput[]>([{ ...emptyFabricaForm }]);
  const [formErrors, setFormErrors] = useState<FabricaFormErrors[]>([{}]);
  const [records, setRecords] = useState<FabricaRecord[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function loadRecords() {
    setLoadingList(true);
    try {
      const rows = await listFabrica();
      setRecords(rows);
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    void loadRecords();
  }, []);

  function onAddForm() {
    setForms((prev) => [...prev, { ...emptyFabricaForm }]);
    setFormErrors((prev) => [...prev, {}]);
  }

  function onRemoveForm(index: number) {
    if (forms.length === 1) return;
    setForms((prev) => prev.filter((_, current) => current !== index));
    setFormErrors((prev) => prev.filter((_, current) => current !== index));
  }

  function onChange<K extends keyof FabricaFormInput>(index: number, field: K, value: FabricaFormInput[K]) {
    setForms((prev) => prev.map((form, current) => (current === index ? { ...form, [field]: value } : form)));
    setFormErrors((prev) =>
      prev.map((blockError, current) =>
        current === index ? { ...blockError, [field]: undefined } : blockError,
      ),
    );
  }

  function normalizePayload(values: FabricaFormInput): FabricaPayload {
    const body: FabricaPayload = {
      tipoRequisicion: values.tipoRequisicion.trim(),
      cantidadModulos: Number(values.cantidadModulos),
      cantidadGranulos: Number(values.cantidadGranulos),
      materiales: values.materiales.trim(),
      cantidadMateriales: Number(values.cantidadMateriales),
      fechaSolicitudOt: values.fechaSolicitudOt,
      solicitante: values.solicitante.trim(),
      fechaEntrega: values.fechaEntrega,
      tipoPaquete: values.tipoPaquete.trim(),
      canalSolicitud: values.canalSolicitud.trim(),
      estado: values.estado.trim(),
      tipoProgreso: values.tipoProgreso.trim(),
      escuela: values.escuela.trim(),
      programa: values.programa.trim(),
      modalidad: values.modalidad.trim(),
      cantidadMaterias: Number(values.cantidadMaterias),
    };

    const enlace = values.enlaceInsumo.trim();
    if (enlace) body.enlaceInsumo = enlace;
    const entregaInsumo = values.entregaInsumo.trim();
    if (entregaInsumo) body.entregaInsumo = entregaInsumo;

    return body;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: FabricaFormErrors[] = forms.map(() => ({}));
    const payloads: FabricaPayload[] = [];

    forms.forEach((form, index) => {
      const parsed = fabricaSchema.safeParse(form);
      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          const key = issue.path[0] as keyof FabricaFormInput | undefined;
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
        await createFabrica(payloads[0]);
        toast.success('Registro creado correctamente');
      } else {
        const created = await createFabricaBulk(payloads);
        toast.success(`Se crearon correctamente ${created.length} registros`);
      }
      setForms([{ ...emptyFabricaForm }]);
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
      <form className="space-y-10" onSubmit={onSubmit} noValidate>
        {forms.map((form, index) => (
          <div key={`fabrica-form-${index}`} className="space-y-6 rounded-xl border border-border/70 p-4 sm:p-6">
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
              <FormSectionTitle>Requisición y materiales</FormSectionTitle>
              <FormFieldGrid>
                <Select
                  label="Tipo de requisición"
                  placeholder="Selecciona…"
                  options={tipoRequisicionOptions}
                  error={formErrors[index]?.tipoRequisicion}
                  value={form.tipoRequisicion}
                  onChange={(event) => onChange(index, 'tipoRequisicion', event.target.value)}
                />
                <Input
                  label="Cantidad de módulos"
                  type="number"
                  min={0}
                  error={formErrors[index]?.cantidadModulos}
                  value={Number(form.cantidadModulos)}
                  onChange={(event) => onChange(index, 'cantidadModulos', Number(event.target.value))}
                />
                <Input
                  label="Cantidad de gránulos"
                  type="number"
                  min={0}
                  error={formErrors[index]?.cantidadGranulos}
                  value={Number(form.cantidadGranulos)}
                  onChange={(event) => onChange(index, 'cantidadGranulos', Number(event.target.value))}
                />
                <div className="sm:col-span-2 lg:col-span-3">
                  <Textarea
                    label="Materiales"
                    placeholder="Detalle de materiales requeridos"
                    error={formErrors[index]?.materiales}
                    value={form.materiales}
                    onChange={(event) => onChange(index, 'materiales', event.target.value)}
                  />
                </div>
                <Input
                  label="Cantidad de materiales"
                  type="number"
                  min={0}
                  error={formErrors[index]?.cantidadMateriales}
                  value={Number(form.cantidadMateriales)}
                  onChange={(event) => onChange(index, 'cantidadMateriales', Number(event.target.value))}
                />
              </FormFieldGrid>
            </FormSection>

            <FormSection>
              <FormSectionTitle>Solicitud y entrega</FormSectionTitle>
              <FormFieldGrid>
                <Input
                  label="Fecha solicitud OT"
                  type="date"
                  error={formErrors[index]?.fechaSolicitudOt}
                  value={form.fechaSolicitudOt}
                  onChange={(event) => onChange(index, 'fechaSolicitudOt', event.target.value)}
                />
                <Input
                  label="Solicitante"
                  placeholder="Nombre completo"
                  error={formErrors[index]?.solicitante}
                  value={form.solicitante}
                  onChange={(event) => onChange(index, 'solicitante', event.target.value)}
                />
                <Input
                  label="Fecha de entrega"
                  type="date"
                  error={formErrors[index]?.fechaEntrega}
                  value={form.fechaEntrega}
                  onChange={(event) => onChange(index, 'fechaEntrega', event.target.value)}
                />
                <Select
                  label="Entrega de insumo"
                  placeholder="Selecciona…"
                  options={entregaInsumoOptions}
                  error={formErrors[index]?.entregaInsumo}
                  value={form.entregaInsumo}
                  onChange={(event) => onChange(index, 'entregaInsumo', event.target.value)}
                />
                <Input
                  label="Enlace de insumo"
                  placeholder="Opcional — https://…"
                  error={formErrors[index]?.enlaceInsumo}
                  value={form.enlaceInsumo}
                  onChange={(event) => onChange(index, 'enlaceInsumo', event.target.value)}
                />
                <Select
                  label="Tipo de paquete"
                  placeholder="Selecciona…"
                  options={tipoPaqueteOptions}
                  error={formErrors[index]?.tipoPaquete}
                  value={form.tipoPaquete}
                  onChange={(event) => onChange(index, 'tipoPaquete', event.target.value)}
                />
                <Select
                  label="Canal de solicitud"
                  placeholder="Selecciona…"
                  options={canalSolicitudOptions}
                  error={formErrors[index]?.canalSolicitud}
                  value={form.canalSolicitud}
                  onChange={(event) => onChange(index, 'canalSolicitud', event.target.value)}
                />
                <Select
                  label="Estado"
                  placeholder="Selecciona…"
                  options={estadoFabricaOptions}
                  error={formErrors[index]?.estado}
                  value={form.estado}
                  onChange={(event) => onChange(index, 'estado', event.target.value)}
                />
                <Select
                  label="Tipo de progreso"
                  placeholder="Selecciona…"
                  options={tipoProgresoOptions}
                  error={formErrors[index]?.tipoProgreso}
                  value={form.tipoProgreso}
                  onChange={(event) => onChange(index, 'tipoProgreso', event.target.value)}
                />
              </FormFieldGrid>
            </FormSection>

            <FormSection>
              <FormSectionTitle>Programa académico</FormSectionTitle>
              <FormFieldGrid>
                <Input
                  label="Escuela"
                  placeholder="Nombre de la escuela"
                  error={formErrors[index]?.escuela}
                  value={form.escuela}
                  onChange={(event) => onChange(index, 'escuela', event.target.value)}
                />
                <Input
                  label="Programa"
                  placeholder="Nombre del programa"
                  error={formErrors[index]?.programa}
                  value={form.programa}
                  onChange={(event) => onChange(index, 'programa', event.target.value)}
                />
                <Select
                  label="Modalidad"
                  placeholder="Selecciona…"
                  options={modalidadOptions}
                  error={formErrors[index]?.modalidad}
                  value={form.modalidad}
                  onChange={(event) => onChange(index, 'modalidad', event.target.value)}
                />
                <Input
                  label="Cantidad de materias"
                  type="number"
                  min={0}
                  error={formErrors[index]?.cantidadMaterias}
                  value={Number(form.cantidadMaterias)}
                  onChange={(event) => onChange(index, 'cantidadMaterias', Number(event.target.value))}
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
        <h3 className="text-sm font-semibold text-foreground">Listado de fábrica</h3>
        {loadingList ? <p className="text-sm text-muted">Cargando registros…</p> : null}
        {!loadingList && records.length === 0 ? <p className="text-sm text-muted">Sin registros aún.</p> : null}
        {!loadingList && records.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-border/70">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-surface-elevated text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Tipo requisición</th>
                  <th className="px-3 py-2">Solicitante</th>
                  <th className="px-3 py-2">Correo creador</th>
                  <th className="px-3 py-2">Estado</th>
                  <th className="px-3 py-2">Fecha entrega</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, index) => (
                  <tr key={`fabrica-row-${record.id ?? index}`} className="border-t border-border/60">
                    <td className="px-3 py-2">{record.id ?? '-'}</td>
                    <td className="px-3 py-2">{record.tipoRequisicion}</td>
                    <td className="px-3 py-2">{record.solicitante}</td>
                    <td className="px-3 py-2">{record.createdByEmail ?? '—'}</td>
                    <td className="px-3 py-2">{record.estado}</td>
                    <td className="px-3 py-2">{record.fechaEntrega}</td>
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
