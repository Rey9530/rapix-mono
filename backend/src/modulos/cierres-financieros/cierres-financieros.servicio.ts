import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RespuestaPaginada } from '../../comun/dto/respuesta-paginada.js';
import { CierreAprobadoEvento } from '../../eventos/cierre-aprobado.evento.js';
import { CierreEnviadoEvento } from '../../eventos/cierre-enviado.evento.js';
import { CierreRechazadoEvento } from '../../eventos/cierre-rechazado.evento.js';
import { EventosDominio } from '../../eventos/eventos-dominio.js';
import type {
  CierreFinanciero,
  EstadoCierreFinanciero,
  Prisma,
  Usuario,
} from '../../generated/prisma/client.js';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';
import { ArchivosServicio } from '../archivos/archivos.servicio.js';
import { AuditoriaServicio } from '../auditoria/auditoria.servicio.js';
import { CrearCierreDto } from './dto/crear-cierre.dto.js';
import { FiltrosCierreDto } from './dto/filtros-cierre.dto.js';
import { RechazarCierreDto } from './dto/rechazar-cierre.dto.js';

// Re-exports retro-compatibles. La verdad vive en `src/eventos/`.
export const EVENTO_CIERRE_ENVIADO = EventosDominio.CierreEnviado;
export const EVENTO_CIERRE_APROBADO = EventosDominio.CierreAprobado;
export const EVENTO_CIERRE_RECHAZADO = EventosDominio.CierreRechazado;

export interface ResumenCierreHoy {
  fecha: string;
  montoEsperado: string;
  cantidadPedidos: number;
  pedidos: Array<{
    id: string;
    codigoSeguimiento: string;
    montoContraEntrega: string;
    entregadoEn: Date;
  }>;
}

interface ArchivoFoto {
  buffer: Buffer;
  mimetype: string;
  originalname?: string;
}

@Injectable()
export class CierresFinancierosServicio {
  constructor(
    private readonly prisma: PrismaServicio,
    private readonly archivos: ArchivosServicio,
    private readonly auditoria: AuditoriaServicio,
    private readonly eventos: EventEmitter2,
  ) {}

  // ──────────────────────────────────────────────────
  // 5.2 — Resumen del día
  // ──────────────────────────────────────────────────

  async obtenerResumenHoy(usuario: Usuario): Promise<ResumenCierreHoy> {
    const perfil = await this.requerirPerfilRepartidor(usuario);
    const { inicio, fin, fechaIso } = rangoDelDia();

    const pedidos = await this.prisma.pedido.findMany({
      where: {
        repartidorEntregaId: perfil.id,
        estado: 'ENTREGADO',
        metodoPago: 'CONTRA_ENTREGA',
        entregadoEn: { gte: inicio, lte: fin },
      },
      select: {
        id: true,
        codigoSeguimiento: true,
        montoContraEntrega: true,
        entregadoEn: true,
      },
      orderBy: { entregadoEn: 'asc' },
    });

    const total = pedidos.reduce(
      (sum, p) => sum + Number(p.montoContraEntrega ?? 0),
      0,
    );

    return {
      fecha: fechaIso,
      montoEsperado: total.toFixed(2),
      cantidadPedidos: pedidos.length,
      pedidos: pedidos.map((p) => ({
        id: p.id,
        codigoSeguimiento: p.codigoSeguimiento,
        montoContraEntrega: (p.montoContraEntrega ?? 0).toString(),
        entregadoEn: p.entregadoEn!,
      })),
    };
  }

  // ──────────────────────────────────────────────────
  // 5.3 + 5.4 + 5.6 — Crear cierre con foto
  // ──────────────────────────────────────────────────

  async crear(
    usuario: Usuario,
    dto: CrearCierreDto,
    foto: ArchivoFoto,
  ): Promise<CierreFinanciero> {
    const perfil = await this.requerirPerfilRepartidor(usuario);
    const { inicio, fin, fechaIso, fechaSoloDia } = rangoDelDia();

    const yaExiste = await this.prisma.cierreFinanciero.findUnique({
      where: { repartidorId_fechaCierre: { repartidorId: perfil.id, fechaCierre: fechaSoloDia } },
    });
    if (yaExiste) {
      throw new ConflictException({
        codigo: 'CIERRE_YA_EXISTE',
        mensaje: 'Ya existe un cierre para hoy',
      });
    }

    const pedidos = await this.prisma.pedido.findMany({
      where: {
        repartidorEntregaId: perfil.id,
        estado: 'ENTREGADO',
        metodoPago: 'CONTRA_ENTREGA',
        entregadoEn: { gte: inicio, lte: fin },
      },
      select: { id: true, montoContraEntrega: true },
    });

    const montoEsperado = pedidos.reduce(
      (sum, p) => sum + Number(p.montoContraEntrega ?? 0),
      0,
    );
    const diferencia = Number(dto.montoReportado) - montoEsperado;
    const estado: EstadoCierreFinanciero =
      diferencia === 0 ? 'PENDIENTE_REVISION' : 'CON_DISCREPANCIA';

    const ext = mimeExt(foto.mimetype);
    const key = ArchivosServicio.armarKeyCierre(perfil.id, fechaIso, ext);
    const subida = await this.archivos.subir(foto.buffer, key, foto.mimetype);

    const cierre = await this.prisma.$transaction(async (tx) => {
      const creado = await tx.cierreFinanciero.create({
        data: {
          repartidorId: perfil.id,
          fechaCierre: fechaSoloDia,
          montoEsperado: montoEsperado.toFixed(2),
          montoReportado: dto.montoReportado.toFixed(2),
          diferencia: diferencia.toFixed(2),
          urlComprobanteFoto: subida.url,
          notas: dto.notas ?? null,
          estado,
        },
      });

      if (pedidos.length > 0) {
        await tx.cierreFinancieroPedido.createMany({
          data: pedidos.map((p) => ({
            cierreId: creado.id,
            pedidoId: p.id,
            monto: (p.montoContraEntrega ?? 0).toString(),
          })),
        });
      }

      return creado;
    });

    this.eventos.emit(
      EventosDominio.CierreEnviado,
      new CierreEnviadoEvento(
        cierre.id,
        cierre.repartidorId,
        fechaIso,
        estado === 'CON_DISCREPANCIA',
      ),
    );

    return cierre;
  }

  // ──────────────────────────────────────────────────
  // 5.5 — Listado, detalle, aprobar, rechazar
  // ──────────────────────────────────────────────────

  async listar(filtros: FiltrosCierreDto): Promise<RespuestaPaginada<CierreFinanciero>> {
    const where: Prisma.CierreFinancieroWhereInput = {};
    if (filtros.estado) where.estado = filtros.estado;
    if (filtros.repartidorId) where.repartidorId = filtros.repartidorId;
    if (filtros.desde || filtros.hasta) {
      where.fechaCierre = {};
      if (filtros.desde) (where.fechaCierre as Prisma.DateTimeFilter).gte = new Date(filtros.desde);
      if (filtros.hasta) (where.fechaCierre as Prisma.DateTimeFilter).lte = new Date(filtros.hasta);
    }

    const skip = (filtros.pagina - 1) * filtros.limite;
    const [filas, total] = await Promise.all([
      this.prisma.cierreFinanciero.findMany({
        where,
        skip,
        take: filtros.limite,
        orderBy: { fechaCierre: 'desc' },
      }),
      this.prisma.cierreFinanciero.count({ where }),
    ]);
    return RespuestaPaginada.de(filas, total, filtros.pagina, filtros.limite);
  }

  async obtenerPorId(usuario: Usuario, id: string) {
    const cierre = await this.prisma.cierreFinanciero.findUnique({
      where: { id },
      include: {
        pedidos: { include: { pedido: { select: { codigoSeguimiento: true, nombreCliente: true } } } },
      },
    });
    if (!cierre) throw new NotFoundException({ codigo: 'CIERRE_NO_ENCONTRADO' });
    if (usuario.rol !== 'ADMIN') {
      const perfil = await this.requerirPerfilRepartidor(usuario);
      if (perfil.id !== cierre.repartidorId) {
        throw new ForbiddenException({ codigo: 'CIERRE_NO_AUTORIZADO' });
      }
    }
    return cierre;
  }

  async aprobar(admin: Usuario, id: string): Promise<CierreFinanciero> {
    const cierre = await this.requerirCierreParaResolver(id);

    const actualizado = await this.prisma.cierreFinanciero.update({
      where: { id },
      data: { estado: 'APROBADO', revisadoPor: admin.id, revisadoEn: new Date() },
    });

    await this.auditoria.registrar({
      usuarioId: admin.id,
      accion: 'CIERRE_APROBADO',
      tipoEntidad: 'CierreFinanciero',
      entidadId: id,
      metadatos: {
        montoEsperado: cierre.montoEsperado.toString(),
        montoReportado: cierre.montoReportado.toString(),
        diferencia: cierre.diferencia.toString(),
      },
    });

    this.eventos.emit(
      EventosDominio.CierreAprobado,
      new CierreAprobadoEvento(id, cierre.repartidorId, admin.id),
    );

    return actualizado;
  }

  async rechazar(
    admin: Usuario,
    id: string,
    dto: RechazarCierreDto,
  ): Promise<CierreFinanciero> {
    const cierre = await this.requerirCierreParaResolver(id);

    const actualizado = await this.prisma.cierreFinanciero.update({
      where: { id },
      data: {
        estado: 'RECHAZADO',
        motivoRechazo: dto.motivo,
        revisadoPor: admin.id,
        revisadoEn: new Date(),
      },
    });

    await this.auditoria.registrar({
      usuarioId: admin.id,
      accion: 'CIERRE_RECHAZADO',
      tipoEntidad: 'CierreFinanciero',
      entidadId: id,
      metadatos: { motivo: dto.motivo },
    });

    this.eventos.emit(
      EventosDominio.CierreRechazado,
      new CierreRechazadoEvento(id, cierre.repartidorId, admin.id, dto.motivo),
    );

    return actualizado;
  }

  // ──────────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────────

  private async requerirCierreParaResolver(id: string): Promise<CierreFinanciero> {
    const cierre = await this.prisma.cierreFinanciero.findUnique({ where: { id } });
    if (!cierre) throw new NotFoundException({ codigo: 'CIERRE_NO_ENCONTRADO' });
    if (cierre.estado !== 'PENDIENTE_REVISION' && cierre.estado !== 'CON_DISCREPANCIA') {
      throw new ConflictException({
        codigo: 'CIERRE_NO_RESOLVABLE',
        mensaje: `El cierre está en estado ${cierre.estado} y no puede modificarse`,
      });
    }
    return cierre;
  }

  private async requerirPerfilRepartidor(usuario: Usuario) {
    const perfil = await this.prisma.perfilRepartidor.findUnique({
      where: { usuarioId: usuario.id },
    });
    if (!perfil) {
      throw new ForbiddenException({
        codigo: 'CIERRE_REPARTIDOR_NO_AUTORIZADO',
        mensaje: 'Usuario no tiene PerfilRepartidor',
      });
    }
    return perfil;
  }
}

// ──────────────────────────────────────────────────
// Utilidades de fecha / mime
// ──────────────────────────────────────────────────

function rangoDelDia(): { inicio: Date; fin: Date; fechaIso: string; fechaSoloDia: Date } {
  const ahora = new Date();
  const inicio = new Date(ahora);
  inicio.setHours(0, 0, 0, 0);
  const fin = new Date(ahora);
  fin.setHours(23, 59, 59, 999);
  const yyyy = inicio.getFullYear();
  const mm = String(inicio.getMonth() + 1).padStart(2, '0');
  const dd = String(inicio.getDate()).padStart(2, '0');
  const fechaIso = `${yyyy}-${mm}-${dd}`;
  const fechaSoloDia = new Date(`${fechaIso}T00:00:00.000Z`);
  return { inicio, fin, fechaIso, fechaSoloDia };
}

function mimeExt(mime: string): string {
  const parte = mime.split('/')[1] ?? 'bin';
  return parte === 'jpeg' ? 'jpg' : parte;
}
