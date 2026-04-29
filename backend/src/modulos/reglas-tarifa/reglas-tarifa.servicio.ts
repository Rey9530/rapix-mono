import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RespuestaPaginada } from '../../comun/dto/respuesta-paginada.js';
import type {
  ModoFacturacion,
  Prisma,
  ReglaTarifa,
} from '../../generated/prisma/client.js';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';
import { AuditoriaServicio } from '../auditoria/auditoria.servicio.js';
import { ActualizarReglaTarifaDto } from './dto/actualizar-regla-tarifa.dto.js';
import { CrearReglaTarifaDto } from './dto/crear-regla-tarifa.dto.js';
import { FiltrosReglaTarifaDto } from './dto/filtros-regla-tarifa.dto.js';

const TIPO_ENTIDAD = 'ReglaTarifa';

@Injectable()
export class ReglasTarifaServicio {
  constructor(
    private readonly prisma: PrismaServicio,
    private readonly auditoria: AuditoriaServicio,
  ) {}

  async crear(dto: CrearReglaTarifaDto, usuarioId: string): Promise<ReglaTarifa> {
    this.validarCoherencia(dto.modoFacturacion, {
      precioPorEnvio: dto.precioPorEnvio,
      tamanoPaquete: dto.tamanoPaquete,
      precioPaquete: dto.precioPaquete,
    });

    if (dto.validaDesde && dto.validaHasta && dto.validaHasta < dto.validaDesde) {
      throw new BadRequestException({
        codigo: 'REGLA_TARIFA_VIGENCIA_INVALIDA',
        mensaje: 'validaHasta debe ser posterior a validaDesde',
      });
    }

    const regla = await this.prisma.reglaTarifa.create({
      data: {
        nombre: dto.nombre,
        modoFacturacion: dto.modoFacturacion,
        precioPorEnvio:
          dto.modoFacturacion === 'POR_ENVIO' ? dto.precioPorEnvio!.toFixed(2) : null,
        tamanoPaquete: dto.modoFacturacion === 'PAQUETE' ? dto.tamanoPaquete! : null,
        precioPaquete:
          dto.modoFacturacion === 'PAQUETE' ? dto.precioPaquete!.toFixed(2) : null,
        activa: dto.activa ?? true,
        validaDesde: dto.validaDesde ?? new Date(),
        validaHasta: dto.validaHasta ?? null,
      },
    });

    await this.auditoria.registrar({
      usuarioId,
      accion: 'REGLA_TARIFA_CREADA',
      tipoEntidad: TIPO_ENTIDAD,
      entidadId: regla.id,
      metadatos: { nombre: regla.nombre, modoFacturacion: regla.modoFacturacion },
    });

    return regla;
  }

  async listar(
    filtros: FiltrosReglaTarifaDto,
  ): Promise<RespuestaPaginada<ReglaTarifa>> {
    const where: Prisma.ReglaTarifaWhereInput = {};
    if (filtros.modoFacturacion) where.modoFacturacion = filtros.modoFacturacion;
    if (filtros.activa !== undefined) where.activa = filtros.activa;
    if (filtros.busqueda) {
      where.nombre = { contains: filtros.busqueda, mode: 'insensitive' };
    }

    const skip = (filtros.pagina - 1) * filtros.limite;
    const [filas, total] = await Promise.all([
      this.prisma.reglaTarifa.findMany({
        where,
        skip,
        take: filtros.limite,
        orderBy: { creadoEn: 'desc' },
      }),
      this.prisma.reglaTarifa.count({ where }),
    ]);

    return RespuestaPaginada.de(filas, total, filtros.pagina, filtros.limite);
  }

  async obtenerPorId(id: string): Promise<ReglaTarifa> {
    const regla = await this.prisma.reglaTarifa.findUnique({ where: { id } });
    if (!regla) {
      throw new NotFoundException({
        codigo: 'REGLA_TARIFA_NO_ENCONTRADA',
        mensaje: 'Regla de tarifa no encontrada',
      });
    }
    return regla;
  }

  async actualizar(
    id: string,
    dto: ActualizarReglaTarifaDto,
    usuarioId: string,
  ): Promise<ReglaTarifa> {
    const existente = await this.obtenerPorId(id);

    const modoFinal = dto.modoFacturacion ?? existente.modoFacturacion;
    const precioPorEnvioFinal: number | undefined =
      dto.precioPorEnvio !== undefined && dto.precioPorEnvio !== null
        ? dto.precioPorEnvio
        : existente.precioPorEnvio !== null
          ? Number(existente.precioPorEnvio)
          : undefined;
    const tamanoPaqueteFinal: number | undefined =
      dto.tamanoPaquete !== undefined && dto.tamanoPaquete !== null
        ? dto.tamanoPaquete
        : (existente.tamanoPaquete ?? undefined);
    const precioPaqueteFinal: number | undefined =
      dto.precioPaquete !== undefined && dto.precioPaquete !== null
        ? dto.precioPaquete
        : existente.precioPaquete !== null
          ? Number(existente.precioPaquete)
          : undefined;

    this.validarCoherencia(modoFinal, {
      precioPorEnvio: precioPorEnvioFinal,
      tamanoPaquete: tamanoPaqueteFinal,
      precioPaquete: precioPaqueteFinal,
    });

    const validaDesdeFinal = dto.validaDesde ?? existente.validaDesde;
    const validaHastaFinal =
      dto.validaHasta !== undefined ? dto.validaHasta : existente.validaHasta;
    if (validaHastaFinal && validaHastaFinal < validaDesdeFinal) {
      throw new BadRequestException({
        codigo: 'REGLA_TARIFA_VIGENCIA_INVALIDA',
        mensaje: 'validaHasta debe ser posterior a validaDesde',
      });
    }

    const datos: Prisma.ReglaTarifaUpdateInput = {};
    if (dto.nombre !== undefined) datos.nombre = dto.nombre;
    if (dto.modoFacturacion !== undefined) datos.modoFacturacion = dto.modoFacturacion;

    // Sincronizar campos según modoFinal: limpiar los que no aplican.
    if (modoFinal === 'POR_ENVIO') {
      datos.precioPorEnvio =
        precioPorEnvioFinal !== undefined ? precioPorEnvioFinal.toFixed(2) : null;
      datos.tamanoPaquete = null;
      datos.precioPaquete = null;
    } else {
      datos.precioPorEnvio = null;
      datos.tamanoPaquete = tamanoPaqueteFinal ?? null;
      datos.precioPaquete =
        precioPaqueteFinal !== undefined ? precioPaqueteFinal.toFixed(2) : null;
    }

    if (dto.activa !== undefined) datos.activa = dto.activa;
    if (dto.validaDesde !== undefined) datos.validaDesde = dto.validaDesde;
    if (dto.validaHasta !== undefined) datos.validaHasta = dto.validaHasta;

    const actualizado = await this.prisma.reglaTarifa.update({
      where: { id },
      data: datos,
    });

    await this.auditoria.registrar({
      usuarioId,
      accion: 'REGLA_TARIFA_ACTUALIZADA',
      tipoEntidad: TIPO_ENTIDAD,
      entidadId: id,
      metadatos: { camposCambiados: Object.keys(datos) },
    });

    return actualizado;
  }

  async desactivar(id: string, usuarioId: string): Promise<ReglaTarifa> {
    const existente = await this.obtenerPorId(id);
    if (!existente.activa) return existente;

    const actualizado = await this.prisma.reglaTarifa.update({
      where: { id },
      data: { activa: false },
    });

    await this.auditoria.registrar({
      usuarioId,
      accion: 'REGLA_TARIFA_DESACTIVADA',
      tipoEntidad: TIPO_ENTIDAD,
      entidadId: id,
    });

    return actualizado;
  }

  async activar(id: string, usuarioId: string): Promise<ReglaTarifa> {
    const existente = await this.obtenerPorId(id);
    if (existente.activa) return existente;

    const actualizado = await this.prisma.reglaTarifa.update({
      where: { id },
      data: { activa: true },
    });

    await this.auditoria.registrar({
      usuarioId,
      accion: 'REGLA_TARIFA_ACTIVADA',
      tipoEntidad: TIPO_ENTIDAD,
      entidadId: id,
    });

    return actualizado;
  }

  private validarCoherencia(
    modo: ModoFacturacion,
    valores: {
      precioPorEnvio?: number;
      tamanoPaquete?: number;
      precioPaquete?: number;
    },
  ): void {
    if (modo === 'POR_ENVIO') {
      if (valores.precioPorEnvio === undefined || valores.precioPorEnvio === null) {
        throw new BadRequestException({
          codigo: 'REGLA_TARIFA_PRECIO_POR_ENVIO_REQUERIDO',
          mensaje: 'precioPorEnvio es requerido cuando modoFacturacion = POR_ENVIO',
        });
      }
      return;
    }

    // PAQUETE
    if (
      valores.tamanoPaquete === undefined ||
      valores.tamanoPaquete === null ||
      valores.precioPaquete === undefined ||
      valores.precioPaquete === null
    ) {
      throw new BadRequestException({
        codigo: 'REGLA_TARIFA_DATOS_PAQUETE_REQUERIDOS',
        mensaje:
          'tamanoPaquete y precioPaquete son requeridos cuando modoFacturacion = PAQUETE',
      });
    }
  }
}
