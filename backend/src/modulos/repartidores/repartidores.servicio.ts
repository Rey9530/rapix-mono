import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { PerfilRepartidor } from '../../generated/prisma/client.js';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';
import { ActualizarUbicacionDto } from './dto/actualizar-ubicacion.dto.js';
import { CrearPerfilRepartidorDto } from './dto/crear-perfil-repartidor.dto.js';

export const EVENTO_UBICACION = 'repartidor.ubicacion_actualizada';

export interface EventoUbicacion {
  repartidorId: string;
  lat: number;
  lng: number;
  ts: Date;
}

@Injectable()
export class RepartidoresServicio {
  constructor(
    private readonly prisma: PrismaServicio,
    private readonly eventos: EventEmitter2,
  ) {}

  async crearPerfil(
    usuarioId: string,
    dto: CrearPerfilRepartidorDto,
    tx?: any,
  ): Promise<PerfilRepartidor> {
    const client = tx ?? this.prisma;

    if (dto.zonaIds && dto.zonaIds.length > 0) {
      const existentes = await client.zona.findMany({
        where: { id: { in: dto.zonaIds } },
        select: { id: true },
      });
      if (existentes.length !== dto.zonaIds.length) {
        throw new BadRequestException('Alguna zonaId no existe');
      }
      if (dto.zonaPrimariaId && !dto.zonaIds.includes(dto.zonaPrimariaId)) {
        throw new BadRequestException('zonaPrimariaId debe estar en zonaIds');
      }
    }

    const perfil = await client.perfilRepartidor.create({
      data: {
        usuarioId,
        tipoVehiculo: dto.tipoVehiculo,
        placa: dto.placa ?? null,
        documentoIdentidad: dto.documentoIdentidad,
        telefonoEmergencia: dto.telefonoEmergencia ?? null,
      },
    });

    if (dto.zonaIds && dto.zonaIds.length > 0) {
      for (const zonaId of dto.zonaIds) {
        await client.zonaRepartidor.create({
          data: {
            repartidorId: perfil.id,
            zonaId,
            esPrimaria: dto.zonaPrimariaId === zonaId,
          },
        });
      }
    }

    return perfil;
  }

  async listar() {
    const repartidores = await this.prisma.perfilRepartidor.findMany({
      include: {
        usuario: true,
        zonas: { include: { zona: { select: { id: true, codigo: true, nombre: true } } } },
      },
      orderBy: { creadoEn: 'desc' },
    });
    return repartidores.map((r) => ({
      id: r.id,
      usuarioId: r.usuarioId,
      nombreCompleto: r.usuario.nombreCompleto,
      email: r.usuario.email,
      estado: r.usuario.estado,
      tipoVehiculo: r.tipoVehiculo,
      placa: r.placa,
      disponible: r.disponible,
      calificacion: r.calificacion,
      totalEntregas: r.totalEntregas,
      ultimaUbicacionEn: r.ultimaUbicacionEn,
      zonas: r.zonas.map((z) => ({
        id: z.zona.id,
        codigo: z.zona.codigo,
        nombre: z.zona.nombre,
        esPrimaria: z.esPrimaria,
      })),
    }));
  }

  async obtenerPorIdAdmin(id: string) {
    const r = await this.prisma.perfilRepartidor.findUnique({
      where: { id },
      include: {
        usuario: true,
        zonas: { include: { zona: { select: { id: true, codigo: true, nombre: true } } } },
      },
    });
    if (!r) throw new NotFoundException('Repartidor no encontrado');
    return r;
  }

  async desempeno(id: string) {
    const r = await this.obtenerPorIdAdmin(id);
    // Fase 3 — tasaExito real a partir de pedidos finalizados (no cancelados)
    // que el rider participó (recogida o entrega).
    const [entregados, fallidosODevueltos, activos] = await Promise.all([
      this.prisma.pedido.count({
        where: {
          estado: 'ENTREGADO',
          OR: [{ repartidorRecogidaId: id }, { repartidorEntregaId: id }],
        },
      }),
      this.prisma.pedido.count({
        where: {
          estado: { in: ['FALLIDO', 'DEVUELTO'] },
          OR: [{ repartidorRecogidaId: id }, { repartidorEntregaId: id }],
        },
      }),
      this.prisma.pedido.count({
        where: {
          estado: { in: ['ASIGNADO', 'RECOGIDO', 'EN_TRANSITO', 'EN_PUNTO_INTERCAMBIO', 'EN_REPARTO'] },
          OR: [{ repartidorRecogidaId: id }, { repartidorEntregaId: id }],
        },
      }),
    ]);
    const finalizados = entregados + fallidosODevueltos;
    const tasaExito = finalizados === 0 ? null : Number((entregados / finalizados).toFixed(4));
    return {
      id: r.id,
      nombreCompleto: r.usuario.nombreCompleto,
      totalEntregas: r.totalEntregas,
      calificacion: r.calificacion,
      entregados,
      fallidosODevueltos,
      activos,
      tasaExito,
      disponible: r.disponible,
    };
  }

  async ubicacion(id: string) {
    const r = await this.prisma.perfilRepartidor.findUnique({
      where: { id },
      select: {
        id: true,
        latitudActual: true,
        longitudActual: true,
        ultimaUbicacionEn: true,
      },
    });
    if (!r) throw new NotFoundException('Repartidor no encontrado');
    return r;
  }

  private async perfilDeUsuario(usuarioId: string): Promise<PerfilRepartidor> {
    const perfil = await this.prisma.perfilRepartidor.findUnique({
      where: { usuarioId },
    });
    if (!perfil) {
      throw new NotFoundException('El usuario autenticado no tiene PerfilRepartidor');
    }
    return perfil;
  }

  async obtenerYo(usuarioId: string) {
    const perfil = await this.perfilDeUsuario(usuarioId);
    const zonas = await this.prisma.zonaRepartidor.findMany({
      where: { repartidorId: perfil.id },
      include: { zona: { select: { id: true, codigo: true, nombre: true } } },
    });
    return {
      ...perfil,
      zonas: zonas.map((z) => ({ ...z.zona, esPrimaria: z.esPrimaria })),
    };
  }

  async cambiarDisponibilidad(usuarioId: string, disponible: boolean) {
    const perfil = await this.perfilDeUsuario(usuarioId);
    return this.prisma.perfilRepartidor.update({
      where: { id: perfil.id },
      data: { disponible },
    });
  }

  async pedidosDeRepartidor(
    usuarioId: string,
    tipo: 'todos' | 'recogidas-pendientes' | 'entregas-pendientes',
  ) {
    const perfil = await this.perfilDeUsuario(usuarioId);
    if (tipo === 'recogidas-pendientes') {
      return this.prisma.pedido.findMany({
        where: { repartidorRecogidaId: perfil.id, estado: 'ASIGNADO' },
        orderBy: { creadoEn: 'asc' },
      });
    }
    if (tipo === 'entregas-pendientes') {
      return this.prisma.pedido.findMany({
        where: { repartidorEntregaId: perfil.id, estado: 'EN_REPARTO' },
        orderBy: { creadoEn: 'asc' },
      });
    }
    return this.prisma.pedido.findMany({
      where: {
        OR: [
          { repartidorRecogidaId: perfil.id },
          { repartidorEntregaId: perfil.id },
        ],
      },
      orderBy: { creadoEn: 'desc' },
      take: 50,
    });
  }

  async actualizarUbicacion(usuarioId: string, dto: ActualizarUbicacionDto) {
    const perfil = await this.perfilDeUsuario(usuarioId);
    const actualizado = await this.prisma.perfilRepartidor.update({
      where: { id: perfil.id },
      data: {
        latitudActual: dto.latitud,
        longitudActual: dto.longitud,
        ultimaUbicacionEn: new Date(),
      },
    });

    const evento: EventoUbicacion = {
      repartidorId: perfil.id,
      lat: dto.latitud,
      lng: dto.longitud,
      ts: actualizado.ultimaUbicacionEn ?? new Date(),
    };
    this.eventos.emit(EVENTO_UBICACION, evento);

    return {
      id: actualizado.id,
      latitud: actualizado.latitudActual,
      longitud: actualizado.longitudActual,
      ultimaUbicacionEn: actualizado.ultimaUbicacionEn,
    };
  }
}
