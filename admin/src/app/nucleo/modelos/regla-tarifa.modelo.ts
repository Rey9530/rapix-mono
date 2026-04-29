export type ModoFacturacion = "POR_ENVIO" | "PAQUETE";

export interface ReglaTarifa {
  id: string;
  nombre: string;
  modoFacturacion: ModoFacturacion;
  precioPorEnvio: string | number | null;
  tamanoPaquete: number | null;
  precioPaquete: string | number | null;
  activa: boolean;
  validaDesde: string;
  validaHasta: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CrearReglaTarifaPayload {
  nombre: string;
  modoFacturacion: ModoFacturacion;
  precioPorEnvio?: number;
  tamanoPaquete?: number;
  precioPaquete?: number;
  activa?: boolean;
  validaDesde?: string;
  validaHasta?: string | null;
}

export interface ActualizarReglaTarifaPayload {
  nombre?: string;
  modoFacturacion?: ModoFacturacion;
  precioPorEnvio?: number | null;
  tamanoPaquete?: number | null;
  precioPaquete?: number | null;
  activa?: boolean;
  validaDesde?: string;
  validaHasta?: string | null;
}

export interface FiltrosReglaTarifa {
  pagina?: number;
  limite?: number;
  modoFacturacion?: ModoFacturacion;
  activa?: boolean;
  busqueda?: string;
}
