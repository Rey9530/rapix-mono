import type { EstadoPaquete } from '../generated/prisma/client.js';

export class PaqueteCompradoEvento {
  constructor(
    public readonly paqueteId: string,
    public readonly vendedorId: string,
    public readonly enviosTotales: number,
    public readonly precio: string,
    public readonly estado: EstadoPaquete,
  ) {}
}
