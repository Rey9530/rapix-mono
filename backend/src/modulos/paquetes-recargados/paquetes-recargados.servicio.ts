import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RespuestaPaginada } from '../../comun/dto/respuesta-paginada.js';
import { EventosDominio } from '../../eventos/eventos-dominio.js';
import { PaqueteCompradoEvento } from '../../eventos/paquete-comprado.evento.js';
import type {
  EstadoPaquete,
  PaqueteRecargado,
  Prisma,
  Usuario,
} from '../../generated/prisma/client.js';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';
import { ActualizarPaqueteDto } from './dto/actualizar-paquete.dto.js';
import { ComprarPaqueteDto } from './dto/comprar-paquete.dto.js';
import { FiltrosPaqueteDto } from './dto/filtros-paquete.dto.js';

// Re-exports retro-compatibles. La verdad vive en `src/eventos/`.
export const EVENTO_PAQUETE_COMPRADO = EventosDominio.PaqueteComprado;
export const EVENTO_PAQUETE_AGOTADO = EventosDominio.PaqueteAgotado;

const TRANSICIONES_VALIDAS: Record<EstadoPaquete, EstadoPaquete[]> = {
  PENDIENTE_PAGO: ['ACTIVO', 'CANCELADO'],
  ACTIVO: ['CANCELADO'],
  AGOTADO: [],
  EXPIRADO: [],
  CANCELADO: [],
};

@Injectable()
export class PaquetesRecargadosServicio {
  constructor(
    private readonly prisma: PrismaServicio,
    private readonly eventos: EventEmitter2,
  ) {}

  // ──────────────────────────────────────────────────
  // Catálogo público (autenticado)
  // ──────────────────────────────────────────────────

  async listarDisponibles() {
    const ahora = new Date();
    return this.prisma.reglaTarifa.findMany({
      where: {
        modoFacturacion: 'PAQUETE',
        activa: true,
        validaDesde: { lte: ahora },
        OR: [{ validaHasta: null }, { validaHasta: { gte: ahora } }],
      },
      orderBy: { precioPaquete: 'asc' },
    });
  }

  // ──────────────────────────────────────────────────
  // Compra (VENDEDOR)
  // ──────────────────────────────────────────────────

  async comprar(usuario: Usuario, dto: ComprarPaqueteDto): Promise<PaqueteRecargado> {
    const perfilVendedor = await this.requerirPerfilVendedor(usuario);

    const regla = await this.prisma.reglaTarifa.findUnique({
      where: { id: dto.reglaTarifaId },
    });
    if (!regla) {
      throw new NotFoundException({ codigo: 'REGLA_TARIFA_NO_ENCONTRADA' });
    }
    if (regla.modoFacturacion !== 'PAQUETE' || !regla.activa) {
      throw new BadRequestException({
        codigo: 'REGLA_TARIFA_NO_COMPRABLE',
        mensaje: 'La regla seleccionada no es un paquete activo',
      });
    }
    if (regla.tamanoPaquete == null || regla.precioPaquete == null) {
      throw new BadRequestException({
        codigo: 'REGLA_TARIFA_INVALIDA',
        mensaje: 'La regla no tiene tamaño o precio de paquete configurado',
      });
    }

    const estadoInicial: EstadoPaquete =
      dto.metodoPago === 'TRANSFERENCIA' ? 'PENDIENTE_PAGO' : 'ACTIVO';

    const expiraEn = dto.diasExpiracion
      ? new Date(Date.now() + dto.diasExpiracion * 24 * 60 * 60 * 1000)
      : null;

    const paquete = await this.prisma.paqueteRecargado.create({
      data: {
        vendedorId: perfilVendedor.id,
        reglaTarifaId: regla.id,
        nombre: regla.nombre,
        enviosTotales: regla.tamanoPaquete,
        enviosRestantes: regla.tamanoPaquete,
        precio: regla.precioPaquete,
        estado: estadoInicial,
        expiraEn,
      },
    });

    this.eventos.emit(
      EventosDominio.PaqueteComprado,
      new PaqueteCompradoEvento(
        paquete.id,
        paquete.vendedorId,
        paquete.enviosTotales,
        paquete.precio.toString(),
        paquete.estado,
      ),
    );

    return paquete;
  }

  // ──────────────────────────────────────────────────
  // Listado y saldo del vendedor
  // ──────────────────────────────────────────────────

  async listarYo(
    usuario: Usuario,
    filtros: FiltrosPaqueteDto,
  ): Promise<RespuestaPaginada<PaqueteRecargado>> {
    const perfil = await this.requerirPerfilVendedor(usuario);

    const where: Prisma.PaqueteRecargadoWhereInput = { vendedorId: perfil.id };
    if (filtros.estado) where.estado = filtros.estado;

    const skip = (filtros.pagina - 1) * filtros.limite;
    const [filas, total] = await Promise.all([
      this.prisma.paqueteRecargado.findMany({
        where,
        skip,
        take: filtros.limite,
        orderBy: { compradoEn: 'desc' },
      }),
      this.prisma.paqueteRecargado.count({ where }),
    ]);

    return RespuestaPaginada.de(filas, total, filtros.pagina, filtros.limite);
  }

  async saldo(usuario: Usuario): Promise<{ saldoRecargado: number; paquetesActivos: number }> {
    const perfil = await this.requerirPerfilVendedor(usuario);
    const agregado = await this.prisma.paqueteRecargado.aggregate({
      where: { vendedorId: perfil.id, estado: 'ACTIVO' },
      _sum: { enviosRestantes: true },
      _count: { _all: true },
    });
    return {
      saldoRecargado: agregado._sum.enviosRestantes ?? 0,
      paquetesActivos: agregado._count._all,
    };
  }

  // ──────────────────────────────────────────────────
  // Listado y mutación admin
  // ──────────────────────────────────────────────────

  async listarAdmin(filtros: FiltrosPaqueteDto): Promise<RespuestaPaginada<PaqueteRecargado>> {
    const where: Prisma.PaqueteRecargadoWhereInput = {};
    if (filtros.estado) where.estado = filtros.estado;
    if (filtros.vendedorId) where.vendedorId = filtros.vendedorId;

    const skip = (filtros.pagina - 1) * filtros.limite;
    const [filas, total] = await Promise.all([
      this.prisma.paqueteRecargado.findMany({
        where,
        skip,
        take: filtros.limite,
        orderBy: { compradoEn: 'desc' },
      }),
      this.prisma.paqueteRecargado.count({ where }),
    ]);

    return RespuestaPaginada.de(filas, total, filtros.pagina, filtros.limite);
  }

  async cambiarEstado(id: string, dto: ActualizarPaqueteDto): Promise<PaqueteRecargado> {
    const paquete = await this.prisma.paqueteRecargado.findUnique({ where: { id } });
    if (!paquete) {
      throw new NotFoundException({ codigo: 'PAQUETE_NO_ENCONTRADO' });
    }

    const permitidos = TRANSICIONES_VALIDAS[paquete.estado] ?? [];
    if (!permitidos.includes(dto.estado)) {
      throw new ConflictException({
        codigo: 'PAQUETE_TRANSICION_INVALIDA',
        mensaje: `No se permite ${paquete.estado} → ${dto.estado}`,
      });
    }

    return this.prisma.paqueteRecargado.update({
      where: { id },
      data: { estado: dto.estado },
    });
  }

  // ──────────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────────

  private async requerirPerfilVendedor(usuario: Usuario) {
    const perfil = await this.prisma.perfilVendedor.findUnique({
      where: { usuarioId: usuario.id },
    });
    if (!perfil) {
      throw new ForbiddenException({
        codigo: 'PAQUETE_VENDEDOR_NO_AUTORIZADO',
        mensaje: 'Usuario no tiene PerfilVendedor',
      });
    }
    return perfil;
  }
}
