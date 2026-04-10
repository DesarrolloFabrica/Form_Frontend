import { createFabrica, listFabrica } from '@/api/fabrica';
import type { FabricaPayload, FabricaRecord } from '@/api/types';
import { FormActionBar, FormFieldGrid, FormSection, FormSectionTitle } from '@/components/FormLayout';
import { Button, Input, type SelectOption, Select, Textarea } from '@/components/UiPrimitives';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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

const fabricaSchema = z.object({
  tipoRequisicion: z.string().min(1, 'Selecciona o indica el tipo de requisición'),
  cantidadModulos: z.coerce.number().min(0, 'Debe ser mayor o igual a 0'),
  cantidadGranulos: z.coerce.number().min(0, 'Debe ser mayor o igual a 0'),
  materiales: z.string().min(1, 'Describe los materiales'),
  cantidadMateriales: z.coerce.number().min(0, 'Debe ser mayor o igual a 0'),
  fechaSolicitudOt: z.string().min(1, 'Indica la fecha de solicitud OT'),
  solicitante: z.string().min(1, 'Indica el solicitante'),
  fechaEntrega: z.string().min(1, 'Indica la fecha de entrega'),
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

const defaultValues: FabricaFormInput = {
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
  const [rows, setRows] = useState<FabricaRecord[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const loadList = useCallback(async () => {
    setListError(null);
    setListLoading(true);
    try {
      setRows(await listFabrica());
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
    formState: { errors, isSubmitting },
  } = useForm<FabricaFormInput>({
    resolver: zodResolver(fabricaSchema),
    defaultValues,
  });

  const onValidSubmit = handleSubmit(async (values) => {
    const body: FabricaPayload = {
      tipoRequisicion: values.tipoRequisicion.trim(),
      cantidadModulos: values.cantidadModulos,
      cantidadGranulos: values.cantidadGranulos,
      materiales: values.materiales.trim(),
      cantidadMateriales: values.cantidadMateriales,
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
      cantidadMaterias: values.cantidadMaterias,
    };

    const enlace = values.enlaceInsumo.trim();
    if (enlace) body.enlaceInsumo = enlace;
    const entregaInsumo = values.entregaInsumo.trim();
    if (entregaInsumo) body.entregaInsumo = entregaInsumo;

    try {
      await createFabrica(body);
      toast.success('Registro creado correctamente.');
      reset(defaultValues);
      await loadList();
    } catch {
      /* interceptor */
    }
  });

  return (
    <div className="space-y-10">
      <form className="space-y-10" onSubmit={onValidSubmit} noValidate>
        <FormSection>
          <FormSectionTitle>Requisición y materiales</FormSectionTitle>
          <FormFieldGrid>
            <Select
              label="Tipo de requisición"
              placeholder="Selecciona…"
              options={tipoRequisicionOptions}
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
              label="Fecha solicitud OT"
              type="date"
              error={errors.fechaSolicitudOt?.message}
              {...register('fechaSolicitudOt')}
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
              label="Entrega de insumo"
              placeholder="Selecciona…"
              options={entregaInsumoOptions}
              error={errors.entregaInsumo?.message}
              {...register('entregaInsumo')}
            />
            <Input
              label="Enlace de insumo"
              placeholder="Opcional — https://…"
              error={errors.enlaceInsumo?.message}
              {...register('enlaceInsumo')}
            />
            <Select
              label="Tipo de paquete"
              placeholder="Selecciona…"
              options={tipoPaqueteOptions}
              error={errors.tipoPaquete?.message}
              {...register('tipoPaquete')}
            />
            <Select
              label="Canal de solicitud"
              placeholder="Selecciona…"
              options={canalSolicitudOptions}
              error={errors.canalSolicitud?.message}
              {...register('canalSolicitud')}
            />
            <Select
              label="Estado"
              placeholder="Selecciona…"
              options={estadoFabricaOptions}
              error={errors.estado?.message}
              {...register('estado')}
            />
            <Select
              label="Tipo de progreso"
              placeholder="Selecciona…"
              options={tipoProgresoOptions}
              error={errors.tipoProgreso?.message}
              {...register('tipoProgreso')}
            />
          </FormFieldGrid>
        </FormSection>

        <FormSection>
          <FormSectionTitle>Programa académico</FormSectionTitle>
          <FormFieldGrid>
            <Input label="Escuela" placeholder="Nombre de la escuela" error={errors.escuela?.message} {...register('escuela')} />
            <Input label="Programa" placeholder="Nombre del programa" error={errors.programa?.message} {...register('programa')} />
            <Select
              label="Modalidad"
              placeholder="Selecciona…"
              options={modalidadOptions}
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
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-border/80 bg-surface-elevated/80 text-xs uppercase text-muted">
                <tr>
                  <th className="px-3 py-2 font-medium">Tipo req.</th>
                  <th className="px-3 py-2 font-medium">Solicitante</th>
                  <th className="px-3 py-2 font-medium">F. solicitud OT</th>
                  <th className="px-3 py-2 font-medium">F. entrega</th>
                  <th className="px-3 py-2 font-medium">Estado</th>
                  <th className="px-3 py-2 font-medium">Escuela</th>
                  <th className="px-3 py-2 font-medium">Programa</th>
                  <th className="px-3 py-2 font-medium">Modalidad</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id ?? `${r.tipoRequisicion}-${r.fechaSolicitudOt}`} className="border-b border-border/60 last:border-0">
                    <td className="px-3 py-2 text-foreground">{r.tipoRequisicion ?? '—'}</td>
                    <td className="px-3 py-2 text-muted">{r.solicitante ?? '—'}</td>
                    <td className="px-3 py-2 text-muted">{r.fechaSolicitudOt ?? '—'}</td>
                    <td className="px-3 py-2 text-muted">{r.fechaEntrega ?? '—'}</td>
                    <td className="px-3 py-2 text-muted">{r.estado ?? '—'}</td>
                    <td className="px-3 py-2 text-muted">{r.escuela ?? '—'}</td>
                    <td className="px-3 py-2 text-muted">{r.programa ?? '—'}</td>
                    <td className="px-3 py-2 text-muted">{r.modalidad ?? '—'}</td>
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
