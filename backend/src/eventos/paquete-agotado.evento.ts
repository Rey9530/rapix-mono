export class PaqueteAgotadoEvento {
  constructor(
    public readonly paqueteId: string,
    public readonly vendedorId: string,
  ) {}
}
