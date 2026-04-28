export interface PuntoGeo {
  lat: number;
  lng: number;
}

export interface Zona {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  poligono?: PuntoGeo[];
  latitudCentro: number;
  longitudCentro: number;
  puntoIntercambioId?: string | null;
  activa: boolean;
  creadoEn?: string;
  actualizadoEn?: string;
}

export interface CrearZonaPayload {
  codigo: string;
  nombre: string;
  descripcion?: string;
  poligono: PuntoGeo[];
  latitudCentro: number;
  longitudCentro: number;
  puntoIntercambioId?: string;
}

export interface ActualizarZonaPayload {
  nombre?: string;
  descripcion?: string;
  poligono?: PuntoGeo[];
  latitudCentro?: number;
  longitudCentro?: number;
  puntoIntercambioId?: string;
  activa?: boolean;
}

export interface AsignarRepartidoresPayload {
  repartidorIds: string[];
  repartidorPrimarioId?: string;
}

export interface RespuestaAsignacionRepartidores {
  asignados: number;
}
