import { FormActionBar, FormFieldGrid, FormSection, FormSectionTitle } from '@/components/FormLayout';
import { Button, Input, type SelectOption, Select, Textarea } from '@/components/UiPrimitives';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const mockTipoRequisicionOptions: SelectOption[] = [
  { value: 'materiales', label: 'Materiales' },
  { value: 'insumos', label: 'Insumos' },
  { value: 'equipo', label: 'Equipo' },
];

const mockEntregaInsumosOptions: SelectOption[] = [
  { value: 'si', label: 'Sí' },
  { value: 'no', label: 'No' },
  { value: 'parcial', label: 'Parcial' },
];

const mockTipoPaqueteOptions: SelectOption[] = [
  { value: 'estandar', label: 'Estándar' },
  { value: 'express', label: 'Express' },
  { value: 'consolidado', label: 'Consolidado' },
];

const mockCanalSolicitudOptions: SelectOption[] = [
  { value: 'teams', label: 'Teams' },
  { value: 'correo', label: 'Correo' },
  { value: 'formulario', label: 'Formulario interno' },
];

const mockEstadoFabricaOptions: SelectOption[] = [
  { value: 'borrador', label: 'Borrador' },
  { value: 'en_revision', label: 'En revisión' },
  { value: 'aprobado', label: 'Aprobado' },
  { value: 'entregado', label: 'Entregado' },
];

const mockTipoProgramaOptions: SelectOption[] = [
  { value: 'pregrado', label: 'Pregrado' },
  { value: 'posgrado', label: 'Posgrado' },
  { value: 'continua', label: 'Educación continua' },
];

const mockModalidadOptions: SelectOption[] = [
  { value: 'presencial', label: 'Presencial' },
  { value: 'virtual', label: 'Virtual' },
  { value: 'dual', label: 'Dual' },
];

const fabricaSchema = z.object({
  tipoRequisicion: z.string().min(1, 'Selecciona o indica el tipo de requisición'),
  cantidadModulos: z.coerce.number().min(0, 'Debe ser mayor o igual a 0'),
  cantidadGranulos: z.coerce.number().min(0, 'Debe ser mayor o igual a 0'),
  materiales: z.string().min(1, 'Describe los materiales'),
  cantidadMateriales: z.coerce.number().min(0, 'Debe ser mayor o igual a 0'),
  fechaSolicitud: z.string().min(1, 'Indica la fecha de solicitud'),
  solicitante: z.string().min(1, 'Indica el solicitante'),
  fechaEntrega: z.string().min(1, 'Indica la fecha de entrega'),
  entregaInsumos: z.string().min(1, 'Indica si hubo entrega de insumos'),
  enlaceInsumo: z
    .string()
    .refine(
      (val) => val.trim() === '' || z.string().url().safeParse(val.trim()).success,
      'Debe ser una URL válida',
    ),
  tipoPaquete: z.string().min(1, 'Indica el tipo de paquete'),
  canalSolicitud: z.string().min(1, 'Selecciona el canal'),
  estado: z.string().min(1, 'Selecciona el estado'),
  tipoPrograma: z.string().min(1, 'Indica el tipo de programa'),
  escuela: z.string().min(1, 'Indica la escuela'),
  programa: z.string().min(1, 'Indica el programa'),
  modalidad: z.string().min(1, 'Selecciona la modalidad'),
  cantidadMaterias: z.coerce.number().min(0, 'Debe ser mayor o igual a 0'),
});

type FabricaFormInput = z.input<typeof fabricaSchema>;

const defaultValues: FabricaFormInput = {
  tipoRequisicion: '',
  cantidadModulos: 0,
  cantidadGranulos: 0,
  materiales: '',
  cantidadMateriales: 0,
  fechaSolicitud: '',
  solicitante: '',
  fechaEntrega: '',
  entregaInsumos: '',
  enlaceInsumo: '',
  tipoPaquete: '',
  canalSolicitud: '',
  estado: '',
  tipoPrograma: '',
  escuela: '',
  programa: '',
  modalidad: '',
  cantidadMaterias: 0,
};

async function wait(ms: number): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}

/** Formulario inventario fábrica (solo UI + validación en cliente). */
export function InventoryFabrica() {
  const [savingDraft, setSavingDraft] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FabricaFormInput>({
    resolver: zodResolver(fabricaSchema),
    defaultValues,
  });

  const onSaveDraft = async () => {
    setSavingDraft(true);
    try {
      await wait(400);
      void getValues();
      toast.success('Borrador guardado localmente.');
    } catch {
      toast.error('No se pudo guardar el borrador.');
    } finally {
      setSavingDraft(false);
    }
  };

  const onValidSubmit = handleSubmit(async () => {
    try {
      await wait(500);
      toast.success('Formulario enviado (simulación en navegador).');
    } catch {
      toast.error('Error al enviar el formulario.');
    }
  });

  return (
    <form className="space-y-10" onSubmit={onValidSubmit} noValidate>
      <FormSection>
        <FormSectionTitle>Requisición y materiales</FormSectionTitle>
        <FormFieldGrid>
          <Select
            label="Tipo de requisición"
            placeholder="Selecciona…"
            options={mockTipoRequisicionOptions}
            error={errors.tipoRequisicion?.message}
            {...register('tipoRequisicion')}
          />
          <Input
            label="Cantidad de módulos"
            type="number"
            min={0}
            error={errors.cantidadModulos?.message}
            {...register('cantidadModulos', { valueAsNumber: true })}
          />
          <Input
            label="Cantidad de gránulos"
            type="number"
            min={0}
            error={errors.cantidadGranulos?.message}
            {...register('cantidadGranulos', { valueAsNumber: true })}
          />
          <div className="sm:col-span-2 lg:col-span-3">
            <Textarea
              label="Materiales"
              placeholder="Detalle de materiales requeridos"
              error={errors.materiales?.message}
              {...register('materiales')}
            />
          </div>
          <Input
            label="Cantidad de materiales"
            type="number"
            min={0}
            error={errors.cantidadMateriales?.message}
            {...register('cantidadMateriales', { valueAsNumber: true })}
          />
        </FormFieldGrid>
      </FormSection>

      <FormSection>
        <FormSectionTitle>Solicitud y entrega</FormSectionTitle>
        <FormFieldGrid>
          <Input
            label="Fecha de solicitud"
            type="date"
            error={errors.fechaSolicitud?.message}
            {...register('fechaSolicitud')}
          />
          <Input
            label="Solicitante"
            placeholder="Nombre completo"
            error={errors.solicitante?.message}
            {...register('solicitante')}
          />
          <Input
            label="Fecha de entrega"
            type="date"
            error={errors.fechaEntrega?.message}
            {...register('fechaEntrega')}
          />
          <Select
            label="Entrega de insumos"
            placeholder="Selecciona…"
            options={mockEntregaInsumosOptions}
            error={errors.entregaInsumos?.message}
            {...register('entregaInsumos')}
          />
          <Input
            label="Enlace de insumo"
            placeholder="https://…"
            error={errors.enlaceInsumo?.message}
            {...register('enlaceInsumo')}
          />
          <Select
            label="Tipo de paquete"
            placeholder="Selecciona…"
            options={mockTipoPaqueteOptions}
            error={errors.tipoPaquete?.message}
            {...register('tipoPaquete')}
          />
          <Select
            label="Canal de solicitud"
            placeholder="Selecciona…"
            options={mockCanalSolicitudOptions}
            error={errors.canalSolicitud?.message}
            {...register('canalSolicitud')}
          />
          <Select
            label="Estado"
            placeholder="Selecciona…"
            options={mockEstadoFabricaOptions}
            error={errors.estado?.message}
            {...register('estado')}
          />
        </FormFieldGrid>
      </FormSection>

      <FormSection>
        <FormSectionTitle>Programa académico</FormSectionTitle>
        <FormFieldGrid>
          <Select
            label="Tipo de programa"
            placeholder="Selecciona…"
            options={mockTipoProgramaOptions}
            error={errors.tipoPrograma?.message}
            {...register('tipoPrograma')}
          />
          <Input label="Escuela" placeholder="Nombre de la escuela" error={errors.escuela?.message} {...register('escuela')} />
          <Input label="Programa" placeholder="Nombre del programa" error={errors.programa?.message} {...register('programa')} />
          <Select
            label="Modalidad"
            placeholder="Selecciona…"
            options={mockModalidadOptions}
            error={errors.modalidad?.message}
            {...register('modalidad')}
          />
          <Input
            label="Cantidad de materias"
            type="number"
            min={0}
            error={errors.cantidadMaterias?.message}
            {...register('cantidadMaterias', { valueAsNumber: true })}
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
