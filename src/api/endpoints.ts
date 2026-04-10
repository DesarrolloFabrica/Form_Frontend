import { apiGet, apiPost } from '@/lib/api';

export interface DesarrolloRecord {
  id: number;
  nombreProyecto: string;
  fechaSolicitud: string;
  fechaEntrega: string;
  solicitante: string;
  estado: string;
  observaciones?: string | null;
}

export interface CreateDesarrolloPayload {
  nombreProyecto: string;
  fechaSolicitud: string;
  fechaEntrega: string;
  solicitante: string;
  estado: string;
  observaciones?: string;
}

export interface FabricaRecord {
  id: number;
  tipoRequisicion: string;
  cantidadModulos: number;
  cantidadGranulos: number;
  materiales: string;
  cantidadMateriales: number;
  fechaSolicitudOt: string;
  solicitante: string;
  fechaEntrega: string;
  entregaInsumo?: string | null;
  enlaceInsumo?: string | null;
  tipoPaquete: string;
  canalSolicitud: string;
  estado: string;
  tipoProgreso: string;
  escuela: string;
  programa: string;
  modalidad: string;
  cantidadMaterias: number;
}

export interface CreateFabricaPayload {
  tipoRequisicion: string;
  cantidadModulos: number;
  cantidadGranulos: number;
  materiales: string;
  cantidadMateriales: number;
  fechaSolicitudOt: string;
  solicitante: string;
  fechaEntrega: string;
  entregaInsumo?: string;
  enlaceInsumo?: string;
  tipoPaquete: string;
  canalSolicitud: string;
  estado: string;
  tipoProgreso: string;
  escuela: string;
  programa: string;
  modalidad: string;
  cantidadMaterias: number;
}

export interface LicenciaRecord {
  id: number;
  nombreLicencias: string;
  correoVinculado: string;
  fechaCompra: string;
  fechaFinalizacion: string;
  tipoLicencia: string;
  coordinacion: string;
  costo: string;
  moneda: string;
}

export interface CreateLicenciaPayload {
  nombreLicencias: string;
  correoVinculado: string;
  fechaCompra: string;
  fechaFinalizacion: string;
  tipoLicencia: string;
  coordinacion: string;
  costo: string;
  moneda: string;
}

export interface LogRecord {
  id: number;
  fechaIngreso: string;
  actor: string;
  tipo: string;
}

export const desarrolloApi = {
  list: () => apiGet<DesarrolloRecord[]>('/desarrollo'),
  create: (body: CreateDesarrolloPayload) => apiPost<DesarrolloRecord>('/desarrollo', body),
};

export const fabricaApi = {
  list: () => apiGet<FabricaRecord[]>('/fabrica'),
  create: (body: CreateFabricaPayload) => apiPost<FabricaRecord>('/fabrica', body),
};

export const licenciasApi = {
  list: () => apiGet<LicenciaRecord[]>('/licencias'),
  create: (body: CreateLicenciaPayload) => apiPost<LicenciaRecord>('/licencias', body),
};

export const logsApi = {
  list: () => apiGet<LogRecord[]>('/logs'),
};
