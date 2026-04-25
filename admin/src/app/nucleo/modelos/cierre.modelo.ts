export type EstadoCierreFinanciero =
  | "PENDIENTE_REVISION"
  | "APROBADO"
  | "RECHAZADO"
  | "CON_DISCREPANCIA";

export interface CierreFinanciero {
  id: string;
  repartidorId: string;
  fechaCierre: string;
  montoEsperado: string;
  montoReportado: string;
  diferencia: string;
  urlComprobanteFoto: string;
  notas?: string | null;
  estado: EstadoCierreFinanciero;
  motivoRechazo?: string | null;
  revisadoPor?: string | null;
  revisadoEn?: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface FiltrosCierre {
  pagina?: number;
  limite?: number;
  estado?: EstadoCierreFinanciero;
  repartidorId?: string;
  desde?: string;
  hasta?: string;
}
