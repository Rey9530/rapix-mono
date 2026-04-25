import type { EstadoPedido } from '../generated/prisma/client.js';

export class PedidoEstadoCambiadoEvento {
  constructor(
    public readonly pedidoId: string,
    public readonly desde: EstadoPedido,
    public readonly hacia: EstadoPedido,
    public readonly actorId: string | null,
    public readonly ts: Date,
  ) {}
}
