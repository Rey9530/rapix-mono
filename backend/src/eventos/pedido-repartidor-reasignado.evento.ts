export class PedidoRepartidorReasignadoEvento {
  constructor(
    public readonly pedidoId: string,
    public readonly lado: 'recogida' | 'entrega',
    public readonly anteriorRepartidorId: string | null,
    public readonly nuevoRepartidorId: string,
    public readonly actorId: string | null,
  ) {}
}
