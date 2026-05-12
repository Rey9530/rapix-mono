export class PedidoActualizadoEvento {
  constructor(
    public readonly pedidoId: string,
    public readonly cambios: string[],
    public readonly actorId: string | null,
  ) {}
}
