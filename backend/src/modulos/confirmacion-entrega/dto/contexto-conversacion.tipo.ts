import type { IntencionConfirmacion } from '../../../generated/prisma/client.js';

export type RolTurnoIa = 'BOT' | 'CLIENTE';

export interface TurnoConversacionIa {
  rol: RolTurnoIa;
  texto: string;
}

export interface ContextoPedidoIa {
  nombreCliente: string;
  nombreNegocio: string;
  codigoSeguimiento: string;
}

export interface ResultadoClasificacionIa {
  intencion: IntencionConfirmacion;
  notaRider: string | null;
  respuestaCliente: string;
  repregunta: boolean;
}
