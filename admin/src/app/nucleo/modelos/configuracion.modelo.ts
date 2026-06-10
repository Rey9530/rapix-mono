export type AplicacionMovil = "CLIENTES" | "REPARTIDORES";

export interface VersionApp {
  aplicacion: AplicacionMovil;
  versionMinima: string;
  actualizadoEn?: string;
}

export interface ActualizarVersionAppPayload {
  versionMinima: string;
}
