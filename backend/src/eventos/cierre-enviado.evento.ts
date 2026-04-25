export class CierreEnviadoEvento {
  constructor(
    public readonly cierreId: string,
    public readonly repartidorId: string,
    public readonly fechaCierre: string,
    public readonly conDiscrepancia: boolean,
  ) {}
}
