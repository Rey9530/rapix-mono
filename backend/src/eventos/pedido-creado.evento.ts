export class PedidoCreadoEvento {
  constructor(
    public readonly pedidoId: string,
    public readonly codigoSeguimiento: string,
    public readonly vendedorId: string,
  ) {}
}
