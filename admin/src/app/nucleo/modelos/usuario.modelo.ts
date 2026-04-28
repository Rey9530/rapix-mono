export type RolUsuario = "ADMIN" | "VENDEDOR" | "REPARTIDOR" | "CLIENTE";

export type EstadoUsuario =
  | "ACTIVO"
  | "INACTIVO"
  | "SUSPENDIDO"
  | "PENDIENTE_VERIFICACION";

export interface Usuario {
  id: string;
  email: string;
  telefono: string;
  nombreCompleto: string;
  rol: RolUsuario;
  estado: EstadoUsuario;
  urlAvatar?: string | null;
  ultimoIngresoEn?: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface RespuestaSesion {
  tokenAcceso: string;
  tokenRefresco: string;
  usuario: Usuario;
}

export interface PerfilAdmin {
  id: string;
  permisos: string[];
}

export interface PerfilVendedor {
  id: string;
  nombreNegocio: string;
  rfc?: string | null;
  direccion: string;
  latitud: number;
  longitud: number;
  urlLogo?: string | null;
  saldoRecargado: number;
  limiteCredito: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface ZonaRepartidor {
  zonaId: string;
  codigo: string;
  nombre: string;
  esPrimaria: boolean;
}

export interface PerfilRepartidor {
  id: string;
  tipoVehiculo: string;
  placa?: string | null;
  documentoIdentidad: string;
  telefonoEmergencia?: string | null;
  disponible: boolean;
  latitudActual?: number | null;
  longitudActual?: number | null;
  ultimaUbicacionEn?: string | null;
  calificacion: number;
  totalEntregas: number;
  zonas: ZonaRepartidor[];
  creadoEn: string;
  actualizadoEn: string;
}

export interface UsuarioDetalle extends Usuario {
  perfilAdmin?: PerfilAdmin | null;
  perfilVendedor?: PerfilVendedor | null;
  perfilRepartidor?: PerfilRepartidor | null;
}
