import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type { Usuario } from '../../generated/prisma/client.js';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';
import { ActualizarCuentaBancariaDto } from './dto/actualizar-cuenta-bancaria.dto.js';
import { CrearCuentaBancariaDto } from './dto/crear-cuenta-bancaria.dto.js';
import {
  CuentaBancariaDto,
  enmascararNumeroCuenta,
} from './dto/cuenta-bancaria.dto.js';

@Injectable()
export class CuentasBancariasServicio {
  private readonly logger = new Logger(CuentasBancariasServicio.name);

  constructor(private readonly prisma: PrismaServicio) {}

  async listar(usuario: Usuario): Promise<CuentaBancariaDto[]> {
    const perfil = await this.requerirPerfilVendedor(usuario);
    const cuentas = await this.prisma.cuentaBancaria.findMany({
      where: { perfilVendedorId: perfil.id, activa: true },
      include: { banco: true },
      orderBy: [{ esPrincipal: 'desc' }, { creadoEn: 'asc' }],
    });
    return cuentas.map((c) =>
      CuentaBancariaDto.desde(c, { enmascarar: false }),
    );
  }

  async crear(
    usuario: Usuario,
    dto: CrearCuentaBancariaDto,
  ): Promise<CuentaBancariaDto> {
    const perfil = await this.requerirPerfilVendedor(usuario);

    const banco = await this.prisma.banco.findUnique({
      where: { id: dto.bancoId },
    });
    if (!banco || !banco.activo) {
      throw new NotFoundException({
        codigo: 'BANCO_NO_ENCONTRADO',
        mensaje: 'El banco seleccionado no existe o no está activo',
      });
    }

    const duplicado = await this.prisma.cuentaBancaria.count({
      where: {
        perfilVendedorId: perfil.id,
        bancoId: dto.bancoId,
        numeroCuenta: dto.numeroCuenta,
        activa: true,
      },
    });
    if (duplicado > 0) {
      throw new ConflictException({
        codigo: 'CUENTA_DUPLICADA',
        mensaje: 'Ya tienes registrada una cuenta con ese banco y número',
      });
    }

    const totalActivas = await this.prisma.cuentaBancaria.count({
      where: { perfilVendedorId: perfil.id, activa: true },
    });
    const esPrimera = totalActivas === 0;
    const debeSerPrincipal = esPrimera || dto.esPrincipal === true;

    const creada = await this.prisma.$transaction(async (tx) => {
      if (debeSerPrincipal && !esPrimera) {
        await tx.cuentaBancaria.updateMany({
          where: {
            perfilVendedorId: perfil.id,
            esPrincipal: true,
            activa: true,
          },
          data: { esPrincipal: false },
        });
      }
      return tx.cuentaBancaria.create({
        data: {
          perfilVendedorId: perfil.id,
          bancoId: dto.bancoId,
          tipoCuenta: dto.tipoCuenta,
          numeroCuenta: dto.numeroCuenta,
          alias: dto.alias ?? null,
          esPrincipal: debeSerPrincipal,
        },
        include: { banco: true },
      });
    });

    this.logger.log(
      `Cuenta bancaria creada id=${creada.id} vendedor=${perfil.id} banco=${banco.codigo} numero=${enmascararNumeroCuenta(creada.numeroCuenta)}`,
    );

    return CuentaBancariaDto.desde(creada, { enmascarar: false });
  }

  async actualizar(
    usuario: Usuario,
    id: string,
    dto: ActualizarCuentaBancariaDto,
  ): Promise<CuentaBancariaDto> {
    const perfil = await this.requerirPerfilVendedor(usuario);

    const cuenta = await this.prisma.cuentaBancaria.findFirst({
      where: { id, perfilVendedorId: perfil.id, activa: true },
    });
    if (!cuenta) {
      throw new NotFoundException({
        codigo: 'CUENTA_NO_ENCONTRADA',
        mensaje: 'La cuenta bancaria no existe',
      });
    }

    const cambios: {
      tipoCuenta?: ActualizarCuentaBancariaDto['tipoCuenta'];
      alias?: string | null;
      esPrincipal?: boolean;
    } = {};
    if (dto.tipoCuenta !== undefined) cambios.tipoCuenta = dto.tipoCuenta;
    if (dto.alias !== undefined) cambios.alias = dto.alias;

    // Lógica de esPrincipal cuando se modifica explícitamente.
    if (dto.esPrincipal !== undefined && dto.esPrincipal !== cuenta.esPrincipal) {
      if (dto.esPrincipal === false) {
        const otrasActivas = await this.prisma.cuentaBancaria.count({
          where: {
            perfilVendedorId: perfil.id,
            id: { not: cuenta.id },
            activa: true,
          },
        });
        if (cuenta.esPrincipal && otrasActivas > 0) {
          throw new BadRequestException({
            codigo: 'DEBE_HABER_PRINCIPAL',
            mensaje:
              'Debes marcar otra cuenta como principal antes de desmarcar esta',
          });
        }
      }
      cambios.esPrincipal = dto.esPrincipal;
    }

    if (Object.keys(cambios).length === 0) {
      const sinCambios = await this.prisma.cuentaBancaria.findUniqueOrThrow({
        where: { id },
        include: { banco: true },
      });
      return CuentaBancariaDto.desde(sinCambios, { enmascarar: false });
    }

    const actualizada = await this.prisma.$transaction(async (tx) => {
      if (cambios.esPrincipal === true) {
        await tx.cuentaBancaria.updateMany({
          where: {
            perfilVendedorId: perfil.id,
            id: { not: cuenta.id },
            esPrincipal: true,
            activa: true,
          },
          data: { esPrincipal: false },
        });
      }
      return tx.cuentaBancaria.update({
        where: { id: cuenta.id },
        data: cambios,
        include: { banco: true },
      });
    });

    return CuentaBancariaDto.desde(actualizada, { enmascarar: false });
  }

  async eliminar(usuario: Usuario, id: string): Promise<void> {
    const perfil = await this.requerirPerfilVendedor(usuario);

    const cuenta = await this.prisma.cuentaBancaria.findFirst({
      where: { id, perfilVendedorId: perfil.id, activa: true },
    });
    if (!cuenta) {
      throw new NotFoundException({
        codigo: 'CUENTA_NO_ENCONTRADA',
        mensaje: 'La cuenta bancaria no existe',
      });
    }

    if (cuenta.esPrincipal) {
      const otrasActivas = await this.prisma.cuentaBancaria.count({
        where: {
          perfilVendedorId: perfil.id,
          id: { not: cuenta.id },
          activa: true,
        },
      });
      if (otrasActivas > 0) {
        throw new BadRequestException({
          codigo: 'REASIGNAR_PRINCIPAL_PRIMERO',
          mensaje:
            'Marca otra cuenta como principal antes de eliminar la actual',
        });
      }
    }

    await this.prisma.cuentaBancaria.update({
      where: { id: cuenta.id },
      data: { activa: false, esPrincipal: false },
    });

    this.logger.log(
      `Cuenta bancaria eliminada id=${cuenta.id} vendedor=${perfil.id} numero=${enmascararNumeroCuenta(cuenta.numeroCuenta)}`,
    );
  }

  private async requerirPerfilVendedor(usuario: Usuario) {
    if (usuario.rol !== 'VENDEDOR') {
      throw new ForbiddenException({
        codigo: 'SOLO_VENDEDORES',
        mensaje:
          'Solo los usuarios con rol VENDEDOR pueden gestionar cuentas bancarias',
      });
    }
    const perfil = await this.prisma.perfilVendedor.findUnique({
      where: { usuarioId: usuario.id },
    });
    if (!perfil) {
      throw new ForbiddenException({
        codigo: 'PERFIL_VENDEDOR_NO_ENCONTRADO',
        mensaje: 'El usuario no tiene perfil de vendedor',
      });
    }
    return perfil;
  }
}
