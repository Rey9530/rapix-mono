import { Injectable } from '@nestjs/common';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';

@Injectable()
export class CodigoSeguimientoServicio {
  constructor(private readonly prisma: PrismaServicio) {}

  /**
   * Usa la secuencia Postgres `pedidos_secuencia` (creada en la migración
   * fase-3-pedidos) para garantizar unicidad sin locks aplicacionales.
   * Formato: DEL-YYYY-NNNNN (mínimo 5 dígitos).
   */
  async generar(): Promise<string> {
    const filas = await this.prisma.$queryRawUnsafe<Array<{ n: bigint }>>(
      `SELECT nextval('pedidos_secuencia') AS n`,
    );
    const n = Number(filas[0].n);
    const anio = new Date().getFullYear();
    return `DEL-${anio}-${String(n).padStart(5, '0')}`;
  }
}
