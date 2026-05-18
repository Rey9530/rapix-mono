export class PaqueteAutorizadoEvento {
  constructor(
    public readonly paqueteId: string,
    public readonly vendedorId: string,
    public readonly enviosTotales: number,
    public readonly precio: string,
    public readonly adminId: string,
  ) {}
}
