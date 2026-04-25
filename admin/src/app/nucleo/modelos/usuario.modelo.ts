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
