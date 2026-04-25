import { Injectable, InternalServerErrorException } from '@nestjs/common';
import type { ModoFacturacion, Prisma } from '../../generated/prisma/client.js';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';

export interface ResolucionFacturacion {
  modoFacturacion: ModoFacturacion;
  costoEnvio: Prisma.Decimal | number;
  paqueteRecargadoId: string | null;
}

type ClienteTransaccional = Prisma.TransactionClient;

@Injectable()
export class FacturacionServicio {
  constructor(private readonly prisma: PrismaServicio) {}

  /**
   * Determina cómo se factura un nuevo pedido del vendedor:
   *  - Si tiene un paquete ACTIVO con saldo (FIFO por compradoEn) → PAQUETE, costo 0.
   *  - Si no → POR_ENVIO, costo = ReglaTarifa activa POR_ENVIO.
   *
   * Acepta opcionalmente el cliente de transacción para que el caller pueda
   * resolver y descontar el paquete dentro de la misma $transaction.
   */
  async resolveBilling(
    vendedorId: string,
    tx?: ClienteTransaccional,
  ): Promise<ResolucionFacturacion> {
    const cliente = tx ?? this.prisma;

    const paquete = await cliente.paqueteRecargado.findFirst({
      where: {
        vendedorId,
        estado: 'ACTIVO',
        enviosRestantes: { gt: 0 },
      },
      orderBy: { compradoEn: 'asc' },
      select: { id: true },
    });

    if (paquete) {
      return {
        modoFacturacion: 'PAQUETE',
        costoEnvio: 0,
        paqueteRecargadoId: paquete.id,
      };
    }

    const ahora = new Date();
    const regla = await cliente.reglaTarifa.findFirst({
      where: {
        modoFacturacion: 'POR_ENVIO',
        activa: true,
        validaDesde: { lte: ahora },
        OR: [{ validaHasta: null }, { validaHasta: { gte: ahora } }],
      },
      orderBy: { validaDesde: 'desc' },
    });

    if (!regla || regla.precioPorEnvio == null) {
      throw new InternalServerErrorException({
        codigo: 'REGLA_TARIFA_POR_ENVIO_FALTANTE',
        mensaje: 'No hay ReglaTarifa activa de modoFacturacion=POR_ENVIO',
      });
    }

    return {
      modoFacturacion: 'POR_ENVIO',
      costoEnvio: regla.precioPorEnvio,
      paqueteRecargadoId: null,
    };
  }
}
