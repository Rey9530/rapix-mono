import type { Notificacion, Usuario } from '../../../generated/prisma/client.js';

export interface ContextoEnvio {
  notificacion: Notificacion;
  usuario: Usuario | null;
}

/**
 * Contrato común para todos los canales de notificación.
 * Cada implementación debe lanzar excepción si no puede entregar el mensaje;
 * la fachada captura el error y marca la notificación como FALLIDO.
 */
export interface CanalAdaptador {
  enviar(ctx: ContextoEnvio): Promise<void>;
  disponible(): boolean;
}

export class CanalNoConfiguradoError extends Error {
  constructor(canal: string) {
    super(`CANAL_NO_CONFIGURADO:${canal}`);
    this.name = 'CanalNoConfiguradoError';
  }
}
