import type { EstadoPedido } from '../../../generated/prisma/client.js';
import { TransicionInvalidaException } from './transicion-invalida.excepcion.js';

/**
 * Grafo declarativo de transiciones permitidas.
 * Terminales (sin salida): ENTREGADO, CANCELADO, DEVUELTO.
 */
export const TRANSICIONES: Record<EstadoPedido, EstadoPedido[]> = {
  PENDIENTE_ASIGNACION: ['ASIGNADO', 'CANCELADO'],
  ASIGNADO: ['RECOGIDO', 'CANCELADO'],
  // FALLIDO desde estados intermedios habilita el corto-circuito iniciado por
  // el cliente via ConfirmacionEntregaModulo (rechazo confirmado o ubicacion
  // alternativa invalida).
  RECOGIDO: ['EN_TRANSITO', 'FALLIDO'],
  EN_TRANSITO: ['EN_PUNTO_INTERCAMBIO', 'FALLIDO'],
  EN_PUNTO_INTERCAMBIO: ['EN_REPARTO', 'FALLIDO'],
  EN_REPARTO: ['ENTREGADO', 'FALLIDO'],
  FALLIDO: ['EN_REPARTO', 'DEVUELTO'],
  ENTREGADO: [],
  CANCELADO: [],
  DEVUELTO: [],
};

export class PedidoMaquinaEstados {
  static validarTransicion(desde: EstadoPedido, hacia: EstadoPedido): void {
    const permitidas = TRANSICIONES[desde] ?? [];
    if (!permitidas.includes(hacia)) {
      throw new TransicionInvalidaException(desde, hacia);
    }
  }

  static transicionesPosibles(desde: EstadoPedido): EstadoPedido[] {
    return [...(TRANSICIONES[desde] ?? [])];
  }

  static esTerminal(estado: EstadoPedido): boolean {
    return (TRANSICIONES[estado] ?? []).length === 0;
  }
}
