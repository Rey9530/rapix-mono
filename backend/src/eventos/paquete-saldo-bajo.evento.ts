export class PaqueteSaldoBajoEvento {
  constructor(
    public readonly paqueteId: string,
    public readonly vendedorId: string,
    public readonly enviosRestantes: number,
  ) {}
}
