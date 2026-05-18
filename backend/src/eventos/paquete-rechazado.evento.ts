export class PaqueteRechazadoEvento {
  constructor(
    public readonly paqueteId: string,
    public readonly vendedorId: string,
    public readonly precio: string,
    public readonly motivo: string | null,
    public readonly adminId: string,
  ) {}
}
