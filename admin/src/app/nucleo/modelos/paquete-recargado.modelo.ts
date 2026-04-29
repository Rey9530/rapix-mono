export type EstadoPaquete =
  | "ACTIVO"
  | "PENDIENTE_PAGO"
  | "AGOTADO"
  | "EXPIRADO"
  | "CANCELADO";

export interface PaqueteRecargado {
  id: string;
  vendedorId: string;
  reglaTarifaId: string;
  nombre: string;
  enviosTotales: number;
  enviosRestantes: number;
  precio: string;
  estado: EstadoPaquete;
  compradoEn: string;
  expiraEn: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface AsignarPaquetePayload {
  reglaTarifaId: string;
  enviosTotales?: number;
  enviosRestantes?: number;
  precio?: number;
  expiraEn?: string;
  notas?: string;
}

export interface ActualizarPaqueteAsignadoPayload {
  enviosRestantes?: number;
  estado?: EstadoPaquete;
  expiraEn?: string | null;
  notas?: string;
}
