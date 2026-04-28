import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RespuestaPaginada } from '../../comun/dto/respuesta-paginada.js';
import { EventosDominio } from '../../eventos/eventos-dominio.js';
import { PaqueteAgotadoEvento } from '../../eventos/paquete-agotado.evento.js';
import { PedidoCreadoEvento } from '../../eventos/pedido-creado.evento.js';
import { PedidoEstadoCambiadoEvento } from '../../eventos/pedido-estado-cambiado.evento.js';
import type {
  EstadoPedido,
  Pedido,
  Prisma,
  Usuario,
} from '../../generated/prisma/client.js';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';
import { ArchivosServicio } from '../archivos/archivos.servicio.js';
import { PaqueteAgotadoException } from '../paquetes-recargados/excepciones/paquete-agotado.excepcion.js';
import { FacturacionServicio } from '../paquetes-recargados/facturacion.servicio.js';
import { GeoServicio } from '../zonas/geo.servicio.js';
import { CodigoSeguimientoServicio } from './codigo-seguimiento.servicio.js';
import { GoogleMapsServicio } from './google-maps.servicio.js';
import { ActualizarPedidoDto } from './dto/actualizar-pedido.dto.js';
import { CancelarPedidoDto } from './dto/cancelar-pedido.dto.js';
import { CrearPedidoDto } from './dto/crear-pedido.dto.js';
import { FiltrosPedidoDto } from './dto/filtros-pedido.dto.js';
import {
  DevolverPedidoDto,
  EnTransitoPedidoDto,
  EntregarPedidoDto,
  FallarPedidoDto,
  LlegarIntercambioPedidoDto,
  RecogerPedidoDto,
  ReintentarPedidoDto,
  TomarEntregaPedidoDto,
} from './dto/transiciones-rider.dto.js';
import { PedidoMaquinaEstados } from './maquina-estados/pedido-maquina-estados.js';

// Re-exports retro-compatibles. La verdad vive en `src/eventos/`.
export const EVENTO_PEDIDO_CREADO = EventosDominio.PedidoCreado;
export const EVENTO_PEDIDO_ESTADO_CAMBIADO = EventosDominio.PedidoEstadoCambiado;

@Injectable()
export class PedidosServicio {
  private readonly logger = new Logger(PedidosServicio.name);

  constructor(
    private readonly prisma: PrismaServicio,
    private readonly geo: GeoServicio,
    private readonly codigoSvc: CodigoSeguimientoServicio,
    private readonly archivos: ArchivosServicio,
    private readonly facturacion: FacturacionServicio,
    private readonly eventos: EventEmitter2,
    private readonly googleMaps: GoogleMapsServicio,
  ) {}

  // ──────────────────────────────────────────────────
  // Creación / CRUD ligero
  // ──────────────────────────────────────────────────

  async crear(
    usuario: Usuario,
    dto: CrearPedidoDto,
    foto?: { buffer: Buffer; mimetype: string; originalname: string },
  ): Promise<Pedido> {
    const perfilVendedor = await this.prisma.perfilVendedor.findUnique({
      where: { usuarioId: usuario.id },
    });
    if (!perfilVendedor) {
      throw new BadRequestException(
        'El usuario autenticado no tiene PerfilVendedor; un admin debe crearlo.',
      );
    }

    // 3.4 — resolución automática de zonas
    const zonaOrigen = await this.geo.resolverZona(dto.latitudOrigen, dto.longitudOrigen);
    if (!zonaOrigen) {
      throw new BadRequestException({
        codigo: 'PEDIDO_ZONA_INVALIDA_ORIGEN',
        mensaje: 'El origen no está dentro de ninguna zona activa',
      });
    }
    const { lat: latitudDestino, lng: longitudDestino } =
      await this.googleMaps.resolverCoordenadas(dto.urlMapasDestino);
    const zonaDestino = await this.geo.resolverZona(latitudDestino, longitudDestino);
    if (!zonaDestino) {
      throw new BadRequestException({
        codigo: 'PEDIDO_ZONA_INVALIDA_DESTINO',
        mensaje: 'El destino no está dentro de ninguna zona activa',
      });
    }

    if (dto.metodoPago === 'CONTRA_ENTREGA' && dto.montoContraEntrega == null) {
      throw new BadRequestException(
        'montoContraEntrega es requerido cuando metodoPago=CONTRA_ENTREGA',
      );
    }

    // Validar la foto ANTES de crear el pedido para no dejar registros huérfanos.
    if (foto) {
      this.archivos.validar(foto.buffer, foto.mimetype);
    }

    const codigoSeguimiento = await this.codigoSvc.generar();

    const resultado = await this.prisma.$transaction(async (tx) => {
      // 4.3 + 4.4 — resolver facturación y descontar paquete dentro de la transacción.
      const billing = await this.facturacion.resolveBilling(perfilVendedor.id, tx);

      let agotado = false;
      if (billing.paqueteRecargadoId) {
        // updateMany condicional = lock atómico de fila vía UPDATE en PostgreSQL.
        const { count } = await tx.paqueteRecargado.updateMany({
          where: {
            id: billing.paqueteRecargadoId,
            enviosRestantes: { gt: 0 },
            estado: 'ACTIVO',
          },
          data: { enviosRestantes: { decrement: 1 } },
        });
        if (count === 0) throw new PaqueteAgotadoException();

        const tras = await tx.paqueteRecargado.findUnique({
          where: { id: billing.paqueteRecargadoId },
          select: { enviosRestantes: true },
        });
        if (tras?.enviosRestantes === 0) {
          await tx.paqueteRecargado.update({
            where: { id: billing.paqueteRecargadoId },
            data: { estado: 'AGOTADO' },
          });
          agotado = true;
        }
      }

      const creado = await tx.pedido.create({
        data: {
          codigoSeguimiento,
          vendedorId: perfilVendedor.id,
          nombreCliente: dto.nombreCliente,
          telefonoCliente: dto.telefonoCliente,
          emailCliente: dto.emailCliente ?? null,
          direccionOrigen: dto.direccionOrigen,
          latitudOrigen: dto.latitudOrigen,
          longitudOrigen: dto.longitudOrigen,
          zonaOrigenId: zonaOrigen.id,
          notasOrigen: dto.notasOrigen ?? null,
          direccionDestino: dto.direccionDestino,
          latitudDestino: latitudDestino,
          longitudDestino: longitudDestino,
          zonaDestinoId: zonaDestino.id,
          notasDestino: dto.notasDestino ?? null,
          descripcionPaquete: dto.descripcionPaquete ?? null,
          pesoPaqueteKg: dto.pesoPaqueteKg ?? null,
          valorDeclarado: dto.valorDeclarado ?? null,
          metodoPago: dto.metodoPago,
          modoFacturacion: billing.modoFacturacion,
          costoEnvio: billing.costoEnvio,
          paqueteRecargadoId: billing.paqueteRecargadoId,
          montoContraEntrega: dto.montoContraEntrega ?? null,
          programadoPara: dto.programadoPara ? new Date(dto.programadoPara) : null,
        },
      });

      await tx.eventoPedido.create({
        data: {
          pedidoId: creado.id,
          estado: creado.estado,
          actorId: usuario.id,
          notas: 'Pedido creado',
        },
      });

      return { pedido: creado, paqueteAgotadoId: agotado ? billing.paqueteRecargadoId : null };
    });

    this.eventos.emit(
      EventosDominio.PedidoCreado,
      new PedidoCreadoEvento(
        resultado.pedido.id,
        resultado.pedido.codigoSeguimiento,
        resultado.pedido.vendedorId,
      ),
    );

    if (resultado.paqueteAgotadoId) {
      this.eventos.emit(
        EventosDominio.PaqueteAgotado,
        new PaqueteAgotadoEvento(resultado.paqueteAgotadoId, resultado.pedido.vendedorId),
      );
    }

    // Subir foto del paquete a MinIO (si fue enviada). Hacemos esto FUERA de la
    // transacción porque la subida puede tomar tiempo y MinIO está fuera del
    // contexto transaccional. Si la subida falla, el pedido ya está creado;
    // logueamos el error y devolvemos el pedido sin URL — la foto es opcional.
    if (foto) {
      try {
        const ext = mimeExt(foto.mimetype);
        const key = ArchivosServicio.armarKeyPaquete(resultado.pedido.id, ext);
        const { url } = await this.archivos.subir(foto.buffer, key, foto.mimetype);
        const actualizado = await this.prisma.pedido.update({
          where: { id: resultado.pedido.id },
          data: { urlFotoPaquete: url },
        });
        return actualizado;
      } catch (error) {
        this.logger.warn(
          `Pedido ${resultado.pedido.id} creado pero la foto no pudo subirse: ${(error as Error).message}`,
        );
      }
    }

    return resultado.pedido;
  }

  async listar(
    usuario: Usuario,
    filtros: FiltrosPedidoDto,
  ): Promise<RespuestaPaginada<Pedido>> {
    const where: Prisma.PedidoWhereInput = {};

    // Scoping por rol
    if (usuario.rol === 'VENDEDOR') {
      const v = await this.prisma.perfilVendedor.findUnique({ where: { usuarioId: usuario.id } });
      if (!v) return RespuestaPaginada.de([], 0, filtros.pagina, filtros.limite);
      where.vendedorId = v.id;
    } else if (usuario.rol === 'REPARTIDOR') {
      const r = await this.prisma.perfilRepartidor.findUnique({ where: { usuarioId: usuario.id } });
      if (!r) return RespuestaPaginada.de([], 0, filtros.pagina, filtros.limite);
      where.OR = [
        { repartidorRecogidaId: r.id },
        { repartidorEntregaId: r.id },
      ];
    }

    if (filtros.estado) where.estado = filtros.estado;
    if (filtros.zonaId) {
      where.OR = [
        ...(where.OR ?? []),
        { zonaOrigenId: filtros.zonaId },
        { zonaDestinoId: filtros.zonaId },
      ];
    }
    if (filtros.vendedorId && usuario.rol === 'ADMIN') where.vendedorId = filtros.vendedorId;
    if (filtros.repartidorId && usuario.rol === 'ADMIN') {
      where.OR = [
        ...(where.OR ?? []),
        { repartidorRecogidaId: filtros.repartidorId },
        { repartidorEntregaId: filtros.repartidorId },
      ];
    }
    if (filtros.desde || filtros.hasta) {
      where.creadoEn = {};
      if (filtros.desde) (where.creadoEn as Prisma.DateTimeFilter).gte = new Date(filtros.desde);
      if (filtros.hasta) (where.creadoEn as Prisma.DateTimeFilter).lte = new Date(filtros.hasta);
    }
    if (filtros.busqueda) {
      where.OR = [
        ...(where.OR ?? []),
        { codigoSeguimiento: { contains: filtros.busqueda, mode: 'insensitive' } },
        { nombreCliente: { contains: filtros.busqueda, mode: 'insensitive' } },
        { telefonoCliente: { contains: filtros.busqueda } },
      ];
    }

    const skip = (filtros.pagina - 1) * filtros.limite;
    const [filas, total] = await Promise.all([
      this.prisma.pedido.findMany({
        where,
        skip,
        take: filtros.limite,
        orderBy: { creadoEn: 'desc' },
      }),
      this.prisma.pedido.count({ where }),
    ]);

    return RespuestaPaginada.de(filas, total, filtros.pagina, filtros.limite);
  }

  async obtenerPorId(usuario: Usuario, id: string) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: {
        eventos: { orderBy: { creadoEn: 'asc' } },
        comprobantes: true,
        zonaOrigen: { select: { id: true, codigo: true, nombre: true } },
        zonaDestino: { select: { id: true, codigo: true, nombre: true } },
        repartidorRecogida: { select: { id: true, usuario: { select: { nombreCompleto: true } } } },
        repartidorEntrega: { select: { id: true, usuario: { select: { nombreCompleto: true } } } },
      },
    });
    if (!pedido) throw new NotFoundException({ codigo: 'PEDIDO_NO_ENCONTRADO' });
    await this.garantizarVisibilidad(usuario, pedido);
    return pedido;
  }

  async listarEventos(usuario: Usuario, id: string) {
    const pedido = await this.prisma.pedido.findUnique({ where: { id } });
    if (!pedido) throw new NotFoundException({ codigo: 'PEDIDO_NO_ENCONTRADO' });
    await this.garantizarVisibilidad(usuario, pedido);
    return this.prisma.eventoPedido.findMany({
      where: { pedidoId: id },
      orderBy: { creadoEn: 'asc' },
    });
  }

  async actualizar(usuario: Usuario, id: string, dto: ActualizarPedidoDto) {
    const pedido = await this.prisma.pedido.findUnique({ where: { id } });
    if (!pedido) throw new NotFoundException({ codigo: 'PEDIDO_NO_ENCONTRADO' });
    if (pedido.estado !== 'PENDIENTE_ASIGNACION') {
      throw new ConflictException({
        codigo: 'PEDIDO_NO_EDITABLE',
        mensaje: `Solo pedidos en PENDIENTE_ASIGNACION son editables (estado actual: ${pedido.estado})`,
      });
    }
    await this.garantizarEdicionVendedor(usuario, pedido);

    const datos: Prisma.PedidoUpdateInput = { ...dto };
    // Si cambian coordenadas, re-resolver zonas.
    if (dto.latitudOrigen !== undefined && dto.longitudOrigen !== undefined) {
      const z = await this.geo.resolverZona(dto.latitudOrigen, dto.longitudOrigen);
      if (!z) throw new BadRequestException({ codigo: 'PEDIDO_ZONA_INVALIDA_ORIGEN' });
      datos.zonaOrigen = { connect: { id: z.id } };
    }
    if (dto.latitudDestino !== undefined && dto.longitudDestino !== undefined) {
      const z = await this.geo.resolverZona(dto.latitudDestino, dto.longitudDestino);
      if (!z) throw new BadRequestException({ codigo: 'PEDIDO_ZONA_INVALIDA_DESTINO' });
      datos.zonaDestino = { connect: { id: z.id } };
    }
    if (dto.programadoPara) datos.programadoPara = new Date(dto.programadoPara);

    return this.prisma.pedido.update({ where: { id }, data: datos });
  }

  async cancelar(usuario: Usuario, id: string, dto: CancelarPedidoDto) {
    const pedido = await this.prisma.pedido.findUnique({ where: { id } });
    if (!pedido) throw new NotFoundException({ codigo: 'PEDIDO_NO_ENCONTRADO' });
    await this.garantizarEdicionVendedor(usuario, pedido);

    PedidoMaquinaEstados.validarTransicion(pedido.estado, 'CANCELADO');

    return this.transicionar({
      pedidoId: id,
      hacia: 'CANCELADO',
      actorId: usuario.id,
      notas: dto.motivo,
      extrasUpdate: { canceladoEn: new Date(), motivoCancelado: dto.motivo ?? null },
    });
  }

  // ──────────────────────────────────────────────────
  // Rider lifecycle (Tarea 3.6)
  // ──────────────────────────────────────────────────

  async recoger(usuario: Usuario, id: string, dto: RecogerPedidoDto) {
    return this.transicionarRider(usuario, id, 'RECOGIDO', 'recogida', dto, {
      recogidoEn: new Date(),
    });
  }

  async enTransito(usuario: Usuario, id: string, dto: EnTransitoPedidoDto) {
    return this.transicionarRider(usuario, id, 'EN_TRANSITO', 'recogida', dto);
  }

  async llegarIntercambio(usuario: Usuario, id: string, dto: LlegarIntercambioPedidoDto) {
    return this.transicionarRider(usuario, id, 'EN_PUNTO_INTERCAMBIO', 'recogida', dto, {
      enIntercambioEn: new Date(),
    });
  }

  /**
   * Al "tomar entrega" se asigna automáticamente el rider autenticado como
   * `repartidorEntregaId` (si aún no hay uno) — este es el único flujo que
   * crea esa relación según el plan.
   */
  async tomarEntrega(usuario: Usuario, id: string, dto: TomarEntregaPedidoDto) {
    const pedido = await this.prisma.pedido.findUnique({ where: { id } });
    if (!pedido) throw new NotFoundException({ codigo: 'PEDIDO_NO_ENCONTRADO' });

    const perfil = await this.requerirPerfilRepartidor(usuario);
    if (pedido.repartidorEntregaId && pedido.repartidorEntregaId !== perfil.id) {
      throw new ForbiddenException({
        codigo: 'PEDIDO_REPARTIDOR_NO_AUTORIZADO',
        mensaje: 'El pedido ya fue tomado por otro repartidor',
      });
    }

    PedidoMaquinaEstados.validarTransicion(pedido.estado, 'EN_REPARTO');

    return this.transicionar({
      pedidoId: id,
      hacia: 'EN_REPARTO',
      actorId: usuario.id,
      latitud: dto.latitud,
      longitud: dto.longitud,
      notas: dto.notas,
      extrasUpdate: { repartidorEntregaId: perfil.id },
    });
  }

  async entregar(
    usuario: Usuario,
    id: string,
    dto: EntregarPedidoDto,
    archivos: {
      foto: { buffer: Buffer; mimetype: string; originalname?: string };
      firma?: { buffer: Buffer; mimetype: string; originalname?: string };
    },
  ) {
    const pedido = await this.prisma.pedido.findUnique({ where: { id } });
    if (!pedido) throw new NotFoundException({ codigo: 'PEDIDO_NO_ENCONTRADO' });

    const perfil = await this.requerirPerfilRepartidor(usuario);
    if (pedido.repartidorEntregaId !== perfil.id) {
      throw new ForbiddenException({ codigo: 'PEDIDO_REPARTIDOR_NO_AUTORIZADO' });
    }

    PedidoMaquinaEstados.validarTransicion(pedido.estado, 'ENTREGADO');

    // Subir foto (obligatoria) y firma (opcional) a MinIO
    const keyFoto = ArchivosServicio.armarKeyEntrega(id, 'foto', mimeExt(archivos.foto.mimetype));
    const resultadoFoto = await this.archivos.subir(
      archivos.foto.buffer,
      keyFoto,
      archivos.foto.mimetype,
    );

    let urlFirma: string | null = null;
    if (archivos.firma) {
      const keyFirma = ArchivosServicio.armarKeyEntrega(id, 'firma', mimeExt(archivos.firma.mimetype));
      const resultadoFirma = await this.archivos.subir(
        archivos.firma.buffer,
        keyFirma,
        archivos.firma.mimetype,
      );
      urlFirma = resultadoFirma.url;
    }

    const pedidoActualizado = await this.prisma.$transaction(async (tx) => {
      const p = await tx.pedido.update({
        where: { id },
        data: { estado: 'ENTREGADO', entregadoEn: new Date() },
      });
      await tx.eventoPedido.create({
        data: {
          pedidoId: id,
          estado: 'ENTREGADO',
          actorId: usuario.id,
          latitud: dto.latitud ?? null,
          longitud: dto.longitud ?? null,
          notas: dto.notas ?? null,
        },
      });
      await tx.comprobanteEntrega.create({
        data: {
          pedidoId: id,
          urlFoto: resultadoFoto.url,
          urlFirma,
          recibidoPor: dto.recibidoPor ?? null,
          notas: dto.notas ?? null,
          latitud: dto.latitud ?? null,
          longitud: dto.longitud ?? null,
        },
      });
      await tx.perfilRepartidor.update({
        where: { id: perfil.id },
        data: { totalEntregas: { increment: 1 } },
      });
      return p;
    });

    this.emitirCambio(id, pedido.estado, 'ENTREGADO', usuario.id);
    return pedidoActualizado;
  }

  async fallar(usuario: Usuario, id: string, dto: FallarPedidoDto) {
    return this.transicionarRider(usuario, id, 'FALLIDO', 'entrega', dto, {
      motivoFallo: dto.motivo,
    });
  }

  async reintentar(usuario: Usuario, id: string, dto: ReintentarPedidoDto) {
    return this.transicionarRider(usuario, id, 'EN_REPARTO', 'entrega', dto);
  }

  async devolver(usuario: Usuario, id: string, dto: DevolverPedidoDto) {
    return this.transicionarRider(usuario, id, 'DEVUELTO', 'entrega', dto);
  }

  // ──────────────────────────────────────────────────
  // Tracking público (Tarea 3.8)
  // ──────────────────────────────────────────────────

  async obtenerPorCodigo(codigo: string) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { codigoSeguimiento: codigo },
      include: {
        eventos: { orderBy: { creadoEn: 'asc' }, select: { estado: true, creadoEn: true } },
        zonaOrigen: { select: { nombre: true } },
        zonaDestino: { select: { nombre: true } },
        repartidorEntrega: {
          select: {
            latitudActual: true,
            longitudActual: true,
            ultimaUbicacionEn: true,
            disponible: true,
          },
        },
      },
    });
    if (!pedido) throw new NotFoundException({ codigo: 'PEDIDO_NO_ENCONTRADO' });

    const siguientePaso = this.siguientePaso(pedido.estado);
    const enRuta = pedido.estado === 'EN_TRANSITO' || pedido.estado === 'EN_REPARTO';

    return {
      codigoSeguimiento: pedido.codigoSeguimiento,
      estado: pedido.estado,
      cliente: { nombre: pedido.nombreCliente },
      origen: { direccion: pedido.direccionOrigen, zona: pedido.zonaOrigen?.nombre ?? null },
      destino: { direccion: pedido.direccionDestino, zona: pedido.zonaDestino?.nombre ?? null },
      ubicacionRepartidor:
        enRuta && pedido.repartidorEntrega?.latitudActual != null
          ? {
              lat: pedido.repartidorEntrega.latitudActual,
              lng: pedido.repartidorEntrega.longitudActual,
              actualizadoEn: pedido.repartidorEntrega.ultimaUbicacionEn,
            }
          : null,
      eventos: pedido.eventos,
      siguientePaso,
    };
  }

  // ──────────────────────────────────────────────────
  // Helpers internos
  // ──────────────────────────────────────────────────

  private async garantizarVisibilidad(usuario: Usuario, pedido: Pedido) {
    if (usuario.rol === 'ADMIN') return;
    if (usuario.rol === 'VENDEDOR') {
      const v = await this.prisma.perfilVendedor.findUnique({ where: { usuarioId: usuario.id } });
      if (!v || v.id !== pedido.vendedorId) {
        throw new ForbiddenException({ codigo: 'PEDIDO_NO_AUTORIZADO' });
      }
      return;
    }
    if (usuario.rol === 'REPARTIDOR') {
      const r = await this.prisma.perfilRepartidor.findUnique({ where: { usuarioId: usuario.id } });
      if (!r || (r.id !== pedido.repartidorRecogidaId && r.id !== pedido.repartidorEntregaId)) {
        throw new ForbiddenException({ codigo: 'PEDIDO_NO_AUTORIZADO' });
      }
    }
  }

  private async garantizarEdicionVendedor(usuario: Usuario, pedido: Pedido) {
    if (usuario.rol === 'ADMIN') return;
    if (usuario.rol !== 'VENDEDOR') {
      throw new ForbiddenException({ codigo: 'PEDIDO_NO_AUTORIZADO' });
    }
    const v = await this.prisma.perfilVendedor.findUnique({ where: { usuarioId: usuario.id } });
    if (!v || v.id !== pedido.vendedorId) {
      throw new ForbiddenException({ codigo: 'PEDIDO_NO_AUTORIZADO' });
    }
  }

  private async requerirPerfilRepartidor(usuario: Usuario) {
    const perfil = await this.prisma.perfilRepartidor.findUnique({
      where: { usuarioId: usuario.id },
    });
    if (!perfil) {
      throw new ForbiddenException({
        codigo: 'PEDIDO_REPARTIDOR_NO_AUTORIZADO',
        mensaje: 'Usuario no tiene PerfilRepartidor',
      });
    }
    return perfil;
  }

  private async transicionarRider(
    usuario: Usuario,
    pedidoId: string,
    hacia: EstadoPedido,
    lado: 'recogida' | 'entrega',
    dto: { latitud?: number; longitud?: number; notas?: string },
    extrasUpdate: Record<string, unknown> = {},
  ) {
    const pedido = await this.prisma.pedido.findUnique({ where: { id: pedidoId } });
    if (!pedido) throw new NotFoundException({ codigo: 'PEDIDO_NO_ENCONTRADO' });

    const perfil = await this.requerirPerfilRepartidor(usuario);
    const asignadoLado = lado === 'recogida' ? pedido.repartidorRecogidaId : pedido.repartidorEntregaId;
    if (asignadoLado !== perfil.id) {
      throw new ForbiddenException({
        codigo: 'PEDIDO_REPARTIDOR_NO_AUTORIZADO',
        mensaje: `No es el repartidor asignado de ${lado} de este pedido`,
      });
    }

    PedidoMaquinaEstados.validarTransicion(pedido.estado, hacia);

    return this.transicionar({
      pedidoId,
      hacia,
      actorId: usuario.id,
      latitud: dto.latitud,
      longitud: dto.longitud,
      notas: dto.notas,
      extrasUpdate,
    });
  }

  private async transicionar(params: {
    pedidoId: string;
    hacia: EstadoPedido;
    actorId: string | null;
    latitud?: number;
    longitud?: number;
    notas?: string;
    extrasUpdate?: Record<string, unknown>;
  }) {
    const { pedidoId, hacia, actorId, latitud, longitud, notas, extrasUpdate } = params;
    const actualizado = await this.prisma.$transaction(async (tx) => {
      const p = await tx.pedido.update({
        where: { id: pedidoId },
        data: { estado: hacia, ...(extrasUpdate ?? {}) },
      });
      await tx.eventoPedido.create({
        data: {
          pedidoId,
          estado: hacia,
          actorId,
          latitud: latitud ?? null,
          longitud: longitud ?? null,
          notas: notas ?? null,
        },
      });
      return p;
    });
    this.emitirCambio(pedidoId, actualizado.estado, hacia, actorId);
    return actualizado;
  }

  private emitirCambio(
    pedidoId: string,
    desde: EstadoPedido,
    hacia: EstadoPedido,
    actorId: string | null,
  ) {
    this.eventos.emit(
      EventosDominio.PedidoEstadoCambiado,
      new PedidoEstadoCambiadoEvento(pedidoId, desde, hacia, actorId, new Date()),
    );
  }

  private siguientePaso(estado: EstadoPedido): string {
    switch (estado) {
      case 'PENDIENTE_ASIGNACION': return 'Esperando asignación de repartidor';
      case 'ASIGNADO': return 'El repartidor irá por tu paquete';
      case 'RECOGIDO': return 'Paquete recogido; en camino al punto de intercambio';
      case 'EN_TRANSITO': return 'En camino al punto de intercambio';
      case 'EN_PUNTO_INTERCAMBIO': return 'En el punto de intercambio, esperando reparto final';
      case 'EN_REPARTO': return 'Salió para entrega';
      case 'ENTREGADO': return 'Entregado';
      case 'FALLIDO': return 'Entrega fallida — en revisión';
      case 'CANCELADO': return 'Pedido cancelado';
      case 'DEVUELTO': return 'Devuelto al vendedor';
      default: return '';
    }
  }
}

function mimeExt(mime: string): string {
  const parte = mime.split('/')[1] ?? 'bin';
  return parte === 'jpeg' ? 'jpg' : parte;
}
