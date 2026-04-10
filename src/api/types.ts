import type { AuthUser } from '@/models';

export interface AuthLoginRequest {
  correo: string;
  contrasena: string;
}

export interface AuthRegisterRequest {
  nombre: string;
  correo: string;
  contrasena: string;
  rol: 'fabrica' | 'desarrollo';
}

export interface AuthLoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface FabricaPayload {
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

export interface FabricaRecord extends FabricaPayload {
  id?: number;
}

export interface DesarrolloPayload {
  nombreProyecto: string;
  fechaSolicitud: string;
  fechaEntrega: string;
  solicitante: string;
  estado: string;
  observaciones?: string;
}

export interface DesarrolloRecord extends DesarrolloPayload {
  id?: number;
}

export interface LicenciasPayload {
  nombreLicencias: string;
  correoVinculado: string;
  fechaCompra: string;
  fechaFinalizacion: string;
  tipoLicencia: string;
  coordinacion: string;
  costo: string;
  moneda: string;
}

export interface LicenciasRecord extends LicenciasPayload {
  id?: number;
}

export interface LogRecord {
  id?: number;
  fechaIngreso?: string;
  actor?: string;
  tipo?: string;
}
