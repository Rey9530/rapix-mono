import { Injectable } from '@nestjs/common';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';
import { ConsumoPaquetesDto } from './dto/consumo-paquetes.dto.js';

export interface FilaConsumoPaquetes {
  vendedorId: string;
  nombreNegocio: string;
  paquetesComprados: number;
  enviosTotales: number;
  enviosConsumidos: number;
  enviosRestantes: number;
  gastoTotal: string;
}

@Injectable()
export class ReportesServicio {
  constructor(private readonly prisma: PrismaServicio) {}

  async consumoPaquetes(dto: ConsumoPaquetesDto): Promise<FilaConsumoPaquetes[]> {
    const desde = new Date(dto.desde);
    const hasta = new Date(dto.hasta);

    const grupos = await this.prisma.paqueteRecargado.groupBy({
      by: ['vendedorId'],
      where: {
        compradoEn: { gte: desde, lte: hasta },
        ...(dto.vendedorId ? { vendedorId: dto.vendedorId } : {}),
      },
      _sum: {
        enviosTotales: true,
        enviosRestantes: true,
        precio: true,
      },
      _count: { _all: true },
    });

    if (grupos.length === 0) return [];

    const vendedores = await this.prisma.perfilVendedor.findMany({
      where: { id: { in: grupos.map((g) => g.vendedorId) } },
      select: { id: true, nombreNegocio: true },
    });
    const nombrePorId = new Map(vendedores.map((v) => [v.id, v.nombreNegocio]));

    return grupos.map((g) => {
      const enviosTotales = g._sum.enviosTotales ?? 0;
      const enviosRestantes = g._sum.enviosRestantes ?? 0;
      return {
        vendedorId: g.vendedorId,
        nombreNegocio: nombrePorId.get(g.vendedorId) ?? '',
        paquetesComprados: g._count._all,
        enviosTotales,
        enviosConsumidos: enviosTotales - enviosRestantes,
        enviosRestantes,
        gastoTotal: (g._sum.precio ?? '0').toString(),
      };
    });
  }
}
