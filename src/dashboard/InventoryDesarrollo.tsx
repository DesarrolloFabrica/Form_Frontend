import { FormActionBar, FormFieldGrid, FormSection } from '@/components/FormLayout';
import { Button, Input, type SelectOption, Select, Textarea } from '@/components/UiPrimitives';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const mockEstadoDesarrolloOptions: SelectOption[] = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en_progreso', label: 'En progreso' },
  { value: 'en_pruebas', label: 'En pruebas' },
  { value: 'entregado', label: 'Entregado' },
  { value: 'detenido', label: 'Detenido' },
];

const desarrolloSchema = z.object({
  nombreProyecto: z.string().min(1, 'Indica el nombre del proyecto'),
  fechaSolicitud: z.string().min(1, 'Indica la fecha de solicitud'),
  fechaEntrega: z.string().min(1, 'Indica la fecha de entrega'),
  solicitante: z.string().min(1, 'Indica el solicitante'),
  estado: z.string().min(1, 'Selecciona el estado'),
  observaciones: z.string().min(1, 'Agrega observaciones'),
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

async function wait(ms: number): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}

export function InventoryDesarrollo() {
  const [savingDraft, setSavingDraft] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<DesarrolloFormInput>({
    resolver: zodResolver(desarrolloSchema),
    defaultValues,
  });

  const onSaveDraft = async () => {
    setSavingDraft(true);
    try {
      await wait(350);
      void getValues();
      toast.success('Borrador guardado.');
    } catch {
      toast.error('No se pudo guardar el borrador.');
    } finally {
      setSavingDraft(false);
    }
  };

  const onValidSubmit = handleSubmit(async () => {
    try {
      await wait(480);
      toast.success('Formulario enviado (simulación en navegador).');
    } catch {
      toast.error('Error al enviar.');
    }
  });

  return (
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
            options={mockEstadoDesarrolloOptions}
            error={errors.estado?.message}
            {...register('estado')}
          />
          <div className="sm:col-span-2 lg:col-span-3">
            <Textarea
              label="Observaciones"
              placeholder="Notas, riesgos, dependencias…"
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
  );
}
