import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RespuestaPaginada } from '../../comun/dto/respuesta-paginada.js';
import { DepositoCreadoEvento } from '../../eventos/deposito-creado.evento.js';
import { EventosDominio } from '../../eventos/eventos-dominio.js';
import { ArchivosServicio } from '../archivos/archivos.servicio.js';
import { Prisma } from '../../generated/prisma/client.js';
import type { Usuario } from '../../generated/prisma/client.js';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';
import { CrearDepositoVendedorDto } from './dto/crear-deposito-vendedor.dto.js';
import { FiltrosDepositosAdminDto } from './dto/filtros-depositos-admin.dto.js';
import { FiltrosHistorialDepositosDto } from './dto/filtros-historial-depositos.dto.js';

interface ArchivoEntrada {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

@Injectable()
export class VendedoresServicio {
  constructor(
    private readonly prisma: PrismaServicio,
    private readonly archivos: ArchivosServicio,
    private readonly eventos: EventEmitter2,
  ) {}

  // ──────────────────────────────────────────────────
  // Endpoints VENDEDOR (self-service)
  // ──────────────────────────────────────────────────

  async obtenerSaldoPendiente(usuario: Usuario) {
    const perfil = await this.requerirPerfilVendedor(usuario);
    return this.obtenerSaldoPendientePorVendedorId(perfil.id);
  }

  async listarHistorialDepositos(
    usuario: Usuario,
    filtros: FiltrosHistorialDepositosDto,
  ) {
    const perfil = await this.requerirPerfilVendedor(usuario);

    const where: Prisma.DepositoVendedorWhereInput = {
      vendedorId: perfil.id,
    };

    if (filtros.desde || filtros.hasta) {
      const rango: Prisma.DateTimeFilter = {};
      if (filtros.desde) rango.gte = new Date(filtros.desde);
      if (filtros.hasta) rango.lte = new Date(filtros.hasta);
      where.fechaDeposito = rango;
    }

    const skip = (filtros.pagina - 1) * filtros.limite;
    const [filas, total] = await Promise.all([
      this.prisma.depositoVendedor.findMany({
        where,
        skip,
        take: filtros.limite,
        orderBy: { fechaDeposito: 'desc' },
        select: {
          id: true,
          fechaDeposito: true,
          monto: true,
          referencia: true,
          urlComprobante: true,
          _count: { select: { pedidos: true } },
          cuentaBancaria: {
            select: {
              id: true,
              alias: true,
              numeroCuenta: true,
              tipoCuenta: true,
              banco: { select: { id: true, nombre: true } },
            },
          },
        },
      }),
      this.prisma.depositoVendedor.count({ where }),
    ]);

    return RespuestaPaginada.de(filas, total, filtros.pagina, filtros.limite);
  }

  async obtenerDepositoDeVendedor(usuario: Usuario, depositoId: string) {
    const perfil = await this.requerirPerfilVendedor(usuario);

    const deposito = await this.prisma.depositoVendedor.findUnique({
      where: { id: depositoId },
      select: {
        id: true,
        vendedorId: true,
        monto: true,
        fechaDeposito: true,
        referencia: true,
        notas: true,
        urlComprobante: true,
        creadoEn: true,
        cuentaBancaria: {
          select: {
            id: true,
            tipoCuenta: true,
            numeroCuenta: true,
            alias: true,
            esPrincipal: true,
            banco: { select: { id: true, codigo: true, nombre: true } },
          },
        },
        pedidos: {
          orderBy: { entregadoEn: 'desc' },
          select: {
            id: true,
            codigoSeguimiento: true,
            nombreCliente: true,
            telefonoCliente: true,
            direccionDestino: true,
            montoContraEntrega: true,
            entregadoEn: true,
            repartidorEntrega: {
              select: {
                id: true,
                usuario: {
                  select: { nombreCompleto: true, telefono: true },
                },
              },
            },
          },
        },
      },
    });

    if (!deposito) {
      throw new NotFoundException({
        codigo: 'DEPOSITO_NO_ENCONTRADO',
        mensaje: 'Deposito no existe',
      });
    }

    if (deposito.vendedorId !== perfil.id) {
      throw new ForbiddenException({
        codigo: 'DEPOSITO_NO_AUTORIZADO',
        mensaje: 'Este deposito no pertenece al vendedor autenticado',
      });
    }

    // No exponer vendedorId al cliente — el vendedor ya sabe quien es.
    const { vendedorId: _vendedorId, ...resto } = deposito;
    return resto;
  }

  // ──────────────────────────────────────────────────
  // Endpoints ADMIN
  // ──────────────────────────────────────────────────

  async listarVendedores() {
    return this.prisma.perfilVendedor.findMany({
      select: {
        id: true,
        nombreNegocio: true,
        usuario: {
          select: { nombreCompleto: true, email: true, telefono: true },
        },
      },
      orderBy: { nombreNegocio: 'asc' },
    });
  }

  async listarCuentasBancariasDeVendedor(vendedorId: string) {
    const perfil = await this.prisma.perfilVendedor.findUnique({
      where: { id: vendedorId },
      select: { id: true },
    });
    if (!perfil) {
      throw new NotFoundException({
        codigo: 'VENDEDOR_NO_ENCONTRADO',
        mensaje: 'PerfilVendedor no existe',
      });
    }
    return this.prisma.cuentaBancaria.findMany({
      where: { perfilVendedorId: vendedorId, activa: true },
      orderBy: [{ esPrincipal: 'desc' }, { creadoEn: 'desc' }],
      select: {
        id: true,
        tipoCuenta: true,
        numeroCuenta: true,
        alias: true,
        esPrincipal: true,
        banco: { select: { id: true, nombre: true } },
      },
    });
  }

  async obtenerSaldoPendientePorVendedorId(vendedorId: string) {
    const perfil = await this.prisma.perfilVendedor.findUnique({
      where: { id: vendedorId },
      select: { id: true },
    });
    if (!perfil) {
      throw new NotFoundException({
        codigo: 'VENDEDOR_NO_ENCONTRADO',
        mensaje: 'PerfilVendedor no existe',
      });
    }

    const wherePendiente: Prisma.PedidoWhereInput = {
      vendedorId: perfil.id,
      metodoPago: 'CONTRA_ENTREGA',
      estado: 'ENTREGADO',
      depositoId: null,
    };

    const [agregado, paquetes] = await Promise.all([
      this.prisma.pedido.aggregate({
        where: wherePendiente,
        _sum: { montoContraEntrega: true },
        _count: { _all: true },
      }),
      this.prisma.pedido.findMany({
        where: wherePendiente,
        select: {
          id: true,
          codigoSeguimiento: true,
          nombreCliente: true,
          direccionDestino: true,
          montoContraEntrega: true,
          entregadoEn: true,
        },
        orderBy: { entregadoEn: 'desc' },
      }),
    ]);

    return {
      totalPendiente: (agregado._sum.montoContraEntrega ?? 0).toString(),
      cantidad: agregado._count._all,
      paquetes,
    };
  }

  async crearDeposito(
    dto: CrearDepositoVendedorDto,
    foto: ArchivoEntrada,
  ) {
    this.archivos.validar(foto.buffer, foto.mimetype);

    const vendedor = await this.prisma.perfilVendedor.findUnique({
      where: { id: dto.vendedorId },
      select: { id: true },
    });
    if (!vendedor) {
      throw new NotFoundException({
        codigo: 'VENDEDOR_NO_ENCONTRADO',
        mensaje: 'PerfilVendedor no existe',
      });
    }

    const idsUnicos = Array.from(new Set(dto.pedidoIds));

    const pedidos = await this.prisma.pedido.findMany({
      where: {
        id: { in: idsUnicos },
        vendedorId: dto.vendedorId,
        metodoPago: 'CONTRA_ENTREGA',
        estado: 'ENTREGADO',
        depositoId: null,
      },
      select: { id: true, montoContraEntrega: true },
    });
    if (pedidos.length !== idsUnicos.length) {
      throw new BadRequestException({
        codigo: 'DEPOSITO_PEDIDOS_INVALIDOS',
        mensaje:
          'Uno o más pedidos no son elegibles (no pertenecen al vendedor, no están ENTREGADO, no son CONTRA_ENTREGA, o ya fueron depositados).',
        esperados: idsUnicos.length,
        validos: pedidos.length,
      });
    }

    const monto = pedidos.reduce(
      (acc, p) => acc.plus(p.montoContraEntrega ?? 0),
      new Prisma.Decimal(0),
    );

    const ext = mimeExt(foto.mimetype);
    const key = ArchivosServicio.armarKeyDeposito(dto.vendedorId, ext);
    const { url } = await this.archivos.subir(foto.buffer, key, foto.mimetype);

    const deposito = await this.prisma.$transaction(async (tx) => {
      const creado = await tx.depositoVendedor.create({
        data: {
          vendedorId: dto.vendedorId,
          cuentaBancariaId: dto.cuentaBancariaId ?? null,
          monto,
          fechaDeposito: dto.fechaDeposito
            ? new Date(dto.fechaDeposito)
            : new Date(),
          referencia: dto.referencia ?? null,
          notas: dto.notas ?? null,
          urlComprobante: url,
        },
      });

      // Doble-check anti race condition: solo asigna a pedidos aún sin depósito.
      const actualizados = await tx.pedido.updateMany({
        where: { id: { in: idsUnicos }, depositoId: null },
        data: { depositoId: creado.id },
      });
      if (actualizados.count !== idsUnicos.length) {
        throw new BadRequestException({
          codigo: 'DEPOSITO_RACE_CONDITION',
          mensaje:
            'Otro depósito tomó uno o más de estos pedidos. Recarga y reintenta.',
        });
      }

      return creado;
    });

    this.eventos.emit(
      EventosDominio.DepositoCreado,
      new DepositoCreadoEvento(
        deposito.id,
        deposito.vendedorId,
        deposito.monto.toString(),
        idsUnicos.length,
        deposito.fechaDeposito,
      ),
    );

    return deposito;
  }

  async obtenerDepositoPorId(depositoId: string) {
    const deposito = await this.prisma.depositoVendedor.findUnique({
      where: { id: depositoId },
      include: {
        vendedor: {
          select: {
            id: true,
            nombreNegocio: true,
            rfc: true,
            direccion: true,
            usuario: {
              select: {
                id: true,
                nombreCompleto: true,
                email: true,
                telefono: true,
              },
            },
          },
        },
        cuentaBancaria: {
          select: {
            id: true,
            tipoCuenta: true,
            numeroCuenta: true,
            alias: true,
            esPrincipal: true,
            banco: { select: { id: true, codigo: true, nombre: true } },
          },
        },
        pedidos: {
          orderBy: { entregadoEn: 'desc' },
          select: {
            id: true,
            codigoSeguimiento: true,
            nombreCliente: true,
            telefonoCliente: true,
            emailCliente: true,
            direccionDestino: true,
            montoContraEntrega: true,
            entregadoEn: true,
            zonaDestino: {
              select: { id: true, codigo: true, nombre: true },
            },
            repartidorEntrega: {
              select: {
                id: true,
                usuario: {
                  select: { nombreCompleto: true, telefono: true },
                },
              },
            },
          },
        },
      },
    });
    if (!deposito) {
      throw new NotFoundException({
        codigo: 'DEPOSITO_NO_ENCONTRADO',
        mensaje: 'Deposito no existe',
      });
    }
    return deposito;
  }

  async listarDepositos(filtros: FiltrosDepositosAdminDto) {
    const where: Prisma.DepositoVendedorWhereInput = {};
    if (filtros.vendedorId) where.vendedorId = filtros.vendedorId;
    if (filtros.desde || filtros.hasta) {
      const rango: Prisma.DateTimeFilter = {};
      if (filtros.desde) rango.gte = new Date(filtros.desde);
      if (filtros.hasta) rango.lte = new Date(filtros.hasta);
      where.fechaDeposito = rango;
    }

    const skip = (filtros.pagina - 1) * filtros.limite;
    const [filas, total] = await Promise.all([
      this.prisma.depositoVendedor.findMany({
        where,
        skip,
        take: filtros.limite,
        orderBy: { fechaDeposito: 'desc' },
        include: {
          vendedor: { select: { id: true, nombreNegocio: true } },
          cuentaBancaria: {
            select: {
              id: true,
              numeroCuenta: true,
              alias: true,
              banco: { select: { nombre: true } },
            },
          },
          _count: { select: { pedidos: true } },
        },
      }),
      this.prisma.depositoVendedor.count({ where }),
    ]);

    return RespuestaPaginada.de(filas, total, filtros.pagina, filtros.limite);
  }

  // ──────────────────────────────────────────────────
  // Helpers privados
  // ──────────────────────────────────────────────────

  private async requerirPerfilVendedor(usuario: Usuario) {
    const perfil = await this.prisma.perfilVendedor.findUnique({
      where: { usuarioId: usuario.id },
    });
    if (!perfil) {
      throw new ForbiddenException({
        codigo: 'VENDEDOR_NO_AUTORIZADO',
        mensaje: 'Usuario no tiene PerfilVendedor',
      });
    }
    return perfil;
  }
}

function mimeExt(mime: string): string {
  const parte = mime.split('/')[1] ?? 'bin';
  return parte === 'jpeg' ? 'jpg' : parte;
}
