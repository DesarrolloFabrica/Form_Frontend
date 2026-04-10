import { createDesarrollo } from '@/api/desarrollo';
import type { DesarrolloPayload } from '@/api/types';
import { FormActionBar, FormFieldGrid, FormSection } from '@/components/FormLayout';
import { Button, Input, type SelectOption, Select, Textarea } from '@/components/UiPrimitives';
import { zodResolver } from '@hookform/resolvers/zod';
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

export function InventoryDesarrollo() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DesarrolloFormInput>({
    resolver: zodResolver(desarrolloSchema),
    defaultValues,
  });

  const onValidSubmit = handleSubmit(async (values) => {
    const body: DesarrolloPayload = {
      nombreProyecto: values.nombreProyecto.trim(),
      fechaSolicitud: values.fechaSolicitud,
      fechaEntrega: values.fechaEntrega,
      solicitante: values.solicitante.trim(),
      estado: values.estado.trim(),
    };
    const obs = values.observaciones?.trim();
    if (obs) body.observaciones = obs;

    try {
      await createDesarrollo(body);
      toast.success('Registro creado correctamente.');
      reset(defaultValues);
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
          <Button type="submit" isLoading={isSubmitting}>
            Enviar
          </Button>
        </FormActionBar>
      </form>
    </div>
  );
}
