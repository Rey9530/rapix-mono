import { Injectable } from '@nestjs/common';
import type { ModoFacturacion, Prisma } from '../../generated/prisma/client.js';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';

export interface ResolucionFacturacion {
  modoFacturacion: ModoFacturacion;
  costoEnvio: Prisma.Decimal | number;
  paqueteRecargadoId: string | null;
}

export type FuentePreview = 'PAQUETE' | 'REGLA' | 'FALLBACK';

export interface PreviewFacturacion {
  modoFacturacion: ModoFacturacion;
  costoEnvio: number;
  fuente: FuentePreview;
}

const COSTO_ENVIO_FALLBACK = 3;

type ClienteTransaccional = Prisma.TransactionClient;

@Injectable()
export class FacturacionServicio {
  constructor(private readonly prisma: PrismaServicio) {}

  /**
   * Determina cómo se factura un nuevo pedido del vendedor:
   *  - Si tiene un paquete ACTIVO con saldo (FIFO por compradoEn) → PAQUETE, costo 0.
   *  - Si no → POR_ENVIO, costo = última ReglaTarifa POR_ENVIO creada y vigente.
   *  - Si no hay regla vigente → POR_ENVIO con fallback de $3.00.
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

    const regla = await this.buscarReglaPorEnvioVigente(cliente);

    if (!regla || regla.precioPorEnvio == null) {
      return {
        modoFacturacion: 'POR_ENVIO',
        costoEnvio: COSTO_ENVIO_FALLBACK,
        paqueteRecargadoId: null,
      };
    }

    return {
      modoFacturacion: 'POR_ENVIO',
      costoEnvio: regla.precioPorEnvio,
      paqueteRecargadoId: null,
    };
  }

  /**
   * Devuelve el costo de envío que se cobraría al vendedor si creara un pedido
   * en este momento, junto con la fuente del valor. No hace cambios en BD.
   * El frontend lo usa para mostrar el costo en pantalla antes de crear el pedido.
   */
  async previewParaVendedor(vendedorId: string): Promise<PreviewFacturacion> {
    const paquete = await this.prisma.paqueteRecargado.findFirst({
      where: {
        vendedorId,
        estado: 'ACTIVO',
        enviosRestantes: { gt: 0 },
      },
      orderBy: { compradoEn: 'asc' },
      select: { id: true },
    });

    if (paquete) {
      return { modoFacturacion: 'PAQUETE', costoEnvio: 0, fuente: 'PAQUETE' };
    }

    const regla = await this.buscarReglaPorEnvioVigente(this.prisma);

    if (!regla || regla.precioPorEnvio == null) {
      return {
        modoFacturacion: 'POR_ENVIO',
        costoEnvio: COSTO_ENVIO_FALLBACK,
        fuente: 'FALLBACK',
      };
    }

    return {
      modoFacturacion: 'POR_ENVIO',
      costoEnvio: Number(regla.precioPorEnvio),
      fuente: 'REGLA',
    };
  }

  private async buscarReglaPorEnvioVigente(
    cliente: ClienteTransaccional | PrismaServicio,
  ) {
    const ahora = new Date();
    return cliente.reglaTarifa.findFirst({
      where: {
        modoFacturacion: 'POR_ENVIO',
        activa: true,
        validaDesde: { lte: ahora },
        OR: [{ validaHasta: null }, { validaHasta: { gte: ahora } }],
      },
      orderBy: { creadoEn: 'desc' },
    });
  }
}
