import { Button } from '@/components/Button';
import { FormActionBar } from '@/components/FormActionBar';
import { FormFieldGrid, FormSection } from '@/components/FormFieldGrid';
import { Input } from '@/components/Input';
import { type SelectOption, Select } from '@/components/Select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const mockTipoLicenciaOptions: SelectOption[] = [
  { value: 'saas', label: 'SaaS' },
  { value: 'perpetua', label: 'Perpetua' },
  { value: 'suscripcion', label: 'Suscripción' },
  { value: 'open_source', label: 'Open source con soporte' },
];

const mockMonedaOptions: SelectOption[] = [
  { value: 'COP', label: 'COP · Peso colombiano' },
  { value: 'USD', label: 'USD · Dólar' },
  { value: 'EUR', label: 'EUR · Euro' },
];

const mockCoordinacionOptions: SelectOption[] = [
  { value: 'tic', label: 'Coordinación TIC' },
  { value: 'fabrica', label: 'Coordinación Fábrica' },
  { value: 'desarrollo', label: 'Coordinación Desarrollo' },
  { value: 'financiera', label: 'Área financiera' },
];

const licenciasSchema = z.object({
  nombreLicencia: z.string().min(1, 'Indica el nombre de la licencia'),
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
  nombreLicencia: '',
  correoVinculado: '',
  fechaCompra: '',
  fechaFinalizacion: '',
  tipoLicencia: '',
  coordinacion: '',
  costo: 0,
  moneda: '',
};

async function wait(ms: number): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}

export function InventoryLicencias() {
  const [savingDraft, setSavingDraft] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LicenciasFormInput>({
    resolver: zodResolver(licenciasSchema),
    defaultValues,
  });

  const onSaveDraft = async () => {
    setSavingDraft(true);
    try {
      await wait(360);
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
      await wait(490);
      toast.success('Formulario enviado (simulación en navegador).');
    } catch {
      toast.error('Error al enviar.');
    }
  });

  return (
    <form className="space-y-8" onSubmit={onValidSubmit} noValidate>
      <FormSection>
        <FormFieldGrid>
          <div className="sm:col-span-2">
            <Input
              label="Nombre de la licencia"
              placeholder="Ej. Microsoft 365 E3"
              error={errors.nombreLicencia?.message}
              {...register('nombreLicencia')}
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
            options={mockTipoLicenciaOptions}
            error={errors.tipoLicencia?.message}
            {...register('tipoLicencia')}
          />
          <Select
            label="Coordinación"
            placeholder="Selecciona…"
            options={mockCoordinacionOptions}
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
            options={mockMonedaOptions}
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
  );
}
