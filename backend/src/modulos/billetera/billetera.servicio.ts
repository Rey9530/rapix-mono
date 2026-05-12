import { ForbiddenException, Injectable } from '@nestjs/common';
import { RespuestaPaginada } from '../../comun/dto/respuesta-paginada.js';
import type {
  MovimientoCajaRepartidor,
  Prisma,
  TipoMovimientoCaja,
  Usuario,
} from '../../generated/prisma/client.js';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';
import { FiltrosHistorialDto } from './dto/filtros-historial.dto.js';

interface ParamsRegistro {
  repartidorId: string;
  pedidoId?: string | null;
  tipo: TipoMovimientoCaja;
  monto: Prisma.Decimal | number | string;
  descripcion?: string | null;
}

@Injectable()
export class BilleteraServicio {
  constructor(private readonly prisma: PrismaServicio) {}

  // Crea un movimiento DENTRO de una transacción existente (lo usan
  // pedidos.servicio.ts al recoger / entregar para mantener atomicidad
  // entre la transición de estado y el registro del cobro).
  async registrarMovimientoEnTx(
    tx: Prisma.TransactionClient,
    params: ParamsRegistro,
  ): Promise<MovimientoCajaRepartidor> {
    return tx.movimientoCajaRepartidor.create({
      data: {
        repartidorId: params.repartidorId,
        pedidoId: params.pedidoId ?? null,
        tipo: params.tipo,
        monto: params.monto as Prisma.Decimal,
        descripcion: params.descripcion ?? null,
      },
    });
  }

  async listarPendientes(usuario: Usuario) {
    const perfil = await this.requerirPerfilRepartidor(usuario);
    return this.prisma.movimientoCajaRepartidor.findMany({
      where: { repartidorId: perfil.id, cierreId: null },
      include: {
        pedido: { select: { codigoSeguimiento: true, nombreCliente: true } },
      },
      orderBy: { creadoEn: 'desc' },
    });
  }

  async obtenerSaldoPendiente(usuario: Usuario): Promise<{
    total: string;
    cantidad: number;
  }> {
    const perfil = await this.requerirPerfilRepartidor(usuario);
    const agregado = await this.prisma.movimientoCajaRepartidor.aggregate({
      where: { repartidorId: perfil.id, cierreId: null },
      _sum: { monto: true },
      _count: { _all: true },
    });
    return {
      total: (agregado._sum.monto ?? 0).toString(),
      cantidad: agregado._count._all,
    };
  }

  async listarHistorial(
    usuario: Usuario,
    filtros: FiltrosHistorialDto,
  ): Promise<RespuestaPaginada<MovimientoCajaRepartidor>> {
    const perfil = await this.requerirPerfilRepartidor(usuario);
    const where: Prisma.MovimientoCajaRepartidorWhereInput = {
      repartidorId: perfil.id,
    };
    if (filtros.tipo) where.tipo = filtros.tipo;
    if (filtros.desde || filtros.hasta) {
      where.creadoEn = {};
      if (filtros.desde)
        (where.creadoEn as Prisma.DateTimeFilter).gte = new Date(filtros.desde);
      if (filtros.hasta)
        (where.creadoEn as Prisma.DateTimeFilter).lte = new Date(filtros.hasta);
    }
    const skip = (filtros.pagina - 1) * filtros.limite;
    const [filas, total] = await Promise.all([
      this.prisma.movimientoCajaRepartidor.findMany({
        where,
        skip,
        take: filtros.limite,
        orderBy: { creadoEn: 'desc' },
        include: {
          pedido: { select: { codigoSeguimiento: true, nombreCliente: true } },
        },
      }),
      this.prisma.movimientoCajaRepartidor.count({ where }),
    ]);
    return RespuestaPaginada.de(filas, total, filtros.pagina, filtros.limite);
  }

  private async requerirPerfilRepartidor(usuario: Usuario) {
    const perfil = await this.prisma.perfilRepartidor.findUnique({
      where: { usuarioId: usuario.id },
    });
    if (!perfil) {
      throw new ForbiddenException({
        codigo: 'BILLETERA_REPARTIDOR_NO_AUTORIZADO',
        mensaje: 'Usuario no tiene PerfilRepartidor',
      });
    }
    return perfil;
  }
}
