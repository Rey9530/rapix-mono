export class CierreRechazadoEvento {
  constructor(
    public readonly cierreId: string,
    public readonly repartidorId: string,
    public readonly revisadoPor: string,
    public readonly motivo?: string,
  ) {}
}
