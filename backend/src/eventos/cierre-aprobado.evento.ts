export class CierreAprobadoEvento {
  constructor(
    public readonly cierreId: string,
    public readonly repartidorId: string,
    public readonly revisadoPor: string,
  ) {}
}
