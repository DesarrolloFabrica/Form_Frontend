import { createLicencias } from '@/api/licencias';
import type { LicenciasPayload } from '@/api/types';
import { FormActionBar, FormFieldGrid, FormSection } from '@/components/FormLayout';
import { Button, Input, type SelectOption, Select } from '@/components/UiPrimitives';
import { zodResolver } from '@hookform/resolvers/zod';
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

function formatCostoString(n: number): string {
  return String(Math.trunc(n));
}

export function InventoryLicencias() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LicenciasFormInput>({
    resolver: zodResolver(licenciasSchema),
    defaultValues,
  });

  const onValidSubmit = handleSubmit(async (values) => {
    const body: LicenciasPayload = {
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
      await createLicencias(body);
      toast.success('Registro creado correctamente.');
      reset(defaultValues);
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
          <Button type="submit" isLoading={isSubmitting}>
            Enviar
          </Button>
        </FormActionBar>
      </form>
    </div>
  );
}
