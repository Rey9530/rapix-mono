import type { EstadoUsuario } from "./usuario.modelo";

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

// ============================================================
// Cobertura de zona con vendedores
// ============================================================

export interface VendedorEnCobertura {
  usuarioId: string;
  perfilVendedorId: string;
  nombreCompleto: string;
  email: string;
  telefono: string | null;
  estado: EstadoUsuario;
  nombreNegocio: string;
  direccion: string;
  latitud: number;
  longitud: number;
  dentroDeZona: boolean;
  distanciaAlCentroMetros: number;
}

export interface PuntoIntercambioEnCobertura {
  id: string;
  nombre: string;
  latitud: number;
  longitud: number;
}

export interface CoberturaVendedores {
  zona: Zona;
  vendedores: VendedorEnCobertura[];
  puntoIntercambio: PuntoIntercambioEnCobertura | null;
}
