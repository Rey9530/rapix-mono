export class DepositoCreadoEvento {
  constructor(
    public readonly depositoId: string,
    public readonly vendedorId: string,
    public readonly monto: string,
    public readonly cantidadPaquetes: number,
    public readonly fechaDeposito: Date,
  ) {}
}
