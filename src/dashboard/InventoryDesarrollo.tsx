import { createDesarrollo, createDesarrolloBulk } from '@/api/desarrollo';
import type { DesarrolloPayload } from '@/api/types';
import { FormActionBar, FormFieldGrid, FormSection } from '@/components/FormLayout';
import { Button, Input, type SelectOption, Select, Textarea } from '@/components/UiPrimitives';
import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const estadoOptions: SelectOption[] = [
  { value: 'Pendiente', label: 'Pendiente' },
  { value: 'En progreso', label: 'En progreso' },
  { value: 'En pruebas', label: 'En pruebas' },
  { value: 'Entregado', label: 'Entregado' },
  { value: 'Detenido', label: 'Detenido' },
];

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Usa formato YYYY-MM-DD');

const desarrolloSchema = z.object({
  nombreProyecto: z.string().min(1, 'Indica el nombre del proyecto'),
  fechaSolicitud: dateSchema,
  fechaEntrega: dateSchema,
  solicitante: z.string().min(1, 'Indica el solicitante'),
  estado: z.string().min(1, 'Selecciona el estado'),
  observaciones: z.string().optional(),
});

type DesarrolloFormInput = z.input<typeof desarrolloSchema>;
type DesarrolloFormErrors = Partial<Record<keyof DesarrolloFormInput, string>>;

const emptyDesarrolloForm: DesarrolloFormInput = {
  nombreProyecto: '',
  fechaSolicitud: '',
  fechaEntrega: '',
  solicitante: '',
  estado: '',
  observaciones: '',
};

export function InventoryDesarrollo() {
  const [forms, setForms] = useState<DesarrolloFormInput[]>([{ ...emptyDesarrolloForm }]);
  const [formErrors, setFormErrors] = useState<DesarrolloFormErrors[]>([{}]);
  const [submitting, setSubmitting] = useState(false);

  function onAddForm() {
    setForms((prev) => [...prev, { ...emptyDesarrolloForm }]);
    setFormErrors((prev) => [...prev, {}]);
  }

  function onRemoveForm(index: number) {
    if (forms.length === 1) return;
    setForms((prev) => prev.filter((_, current) => current !== index));
    setFormErrors((prev) => prev.filter((_, current) => current !== index));
  }

  function onChange<K extends keyof DesarrolloFormInput>(index: number, field: K, value: DesarrolloFormInput[K]) {
    setForms((prev) => prev.map((form, current) => (current === index ? { ...form, [field]: value } : form)));
    setFormErrors((prev) =>
      prev.map((blockError, current) =>
        current === index ? { ...blockError, [field]: undefined } : blockError,
      ),
    );
  }

  function normalizePayload(values: DesarrolloFormInput): DesarrolloPayload {
    const body: DesarrolloPayload = {
      nombreProyecto: values.nombreProyecto.trim(),
      fechaSolicitud: values.fechaSolicitud,
      fechaEntrega: values.fechaEntrega,
      solicitante: values.solicitante.trim(),
      estado: values.estado.trim(),
    };
    const obs = values.observaciones?.trim();
    if (obs) body.observaciones = obs;
    return body;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: DesarrolloFormErrors[] = forms.map(() => ({}));
    const payloads: DesarrolloPayload[] = [];

    forms.forEach((form, index) => {
      const parsed = desarrolloSchema.safeParse(form);
      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          const key = issue.path[0] as keyof DesarrolloFormInput | undefined;
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
        await createDesarrollo(payloads[0]);
        toast.success('Registro creado correctamente');
      } else {
        const created = await createDesarrolloBulk(payloads);
        toast.success(`Se crearon correctamente ${created.length} registros`);
      }
      setForms([{ ...emptyDesarrolloForm }]);
      setFormErrors([{}]);
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
          <div key={`desarrollo-form-${index}`} className="space-y-6 rounded-xl border border-border/70 p-4 sm:p-6">
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
                <div className="sm:col-span-2 lg:col-span-3">
                  <Input
                    label="Nombre del proyecto"
                    placeholder="Ej. Portal de servicios estudiantiles"
                    error={formErrors[index]?.nombreProyecto}
                    value={form.nombreProyecto}
                    onChange={(event) => onChange(index, 'nombreProyecto', event.target.value)}
                  />
                </div>
                <Input
                  label="Fecha de solicitud"
                  type="date"
                  error={formErrors[index]?.fechaSolicitud}
                  value={form.fechaSolicitud}
                  onChange={(event) => onChange(index, 'fechaSolicitud', event.target.value)}
                />
                <Input
                  label="Fecha de entrega"
                  type="date"
                  error={formErrors[index]?.fechaEntrega}
                  value={form.fechaEntrega}
                  onChange={(event) => onChange(index, 'fechaEntrega', event.target.value)}
                />
                <Input
                  label="Solicitante"
                  placeholder="Nombre del solicitante"
                  error={formErrors[index]?.solicitante}
                  value={form.solicitante}
                  onChange={(event) => onChange(index, 'solicitante', event.target.value)}
                />
                <Select
                  label="Estado"
                  placeholder="Selecciona…"
                  options={estadoOptions}
                  error={formErrors[index]?.estado}
                  value={form.estado}
                  onChange={(event) => onChange(index, 'estado', event.target.value)}
                />
                <div className="sm:col-span-2 lg:col-span-3">
                  <Textarea
                    label="Observaciones"
                    placeholder="Opcional — notas, riesgos, dependencias…"
                    error={formErrors[index]?.observaciones}
                    value={form.observaciones}
                    onChange={(event) => onChange(index, 'observaciones', event.target.value)}
                  />
                </div>
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

    </div>
  );
}
