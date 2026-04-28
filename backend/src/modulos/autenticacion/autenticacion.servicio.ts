import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';
import type { Usuario } from '../../generated/prisma/client.js';
import {
  compararContrasena,
  hashearContrasena,
} from '../../comun/utiles/contrasena.js';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';
import { CerrarSesionDto } from './dto/cerrar-sesion.dto.js';
import { IniciarSesionDto } from './dto/iniciar-sesion.dto.js';
import { RefrescarDto } from './dto/refrescar.dto.js';
import { RegistrarDto, RolRegistrable } from './dto/registrar.dto.js';
import { RespuestaAutenticacionDto } from './dto/respuesta-autenticacion.dto.js';
import { UsuarioPublicoDto } from './dto/usuario-publico.dto.js';

interface ContextoPeticion {
  userAgent?: string;
  direccionIp?: string;
}

interface PayloadRefresco {
  sub: string;
  jti: string;
}

@Injectable()
export class AutenticacionServicio {
  private readonly logger = new Logger(AutenticacionServicio.name);

  constructor(
    private readonly prisma: PrismaServicio,
    private readonly jwtService: JwtService,
  ) {}

  async registrar(
    dto: RegistrarDto,
    contexto: ContextoPeticion = {},
  ): Promise<RespuestaAutenticacionDto> {
    const emailExiste = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
    if (emailExiste) throw new ConflictException('El email ya está registrado');

    const telefonoExiste = await this.prisma.usuario.findUnique({
      where: { telefono: dto.telefono },
    });
    if (telefonoExiste) throw new ConflictException('El teléfono ya está registrado');

    if (dto.rol === RolRegistrable.VENDEDOR) {
      if (
        !dto.nombreNegocio ||
        !dto.direccion ||
        dto.latitud === undefined ||
        dto.longitud === undefined
      ) {
        throw new BadRequestException(
          'Para rol VENDEDOR se requieren nombreNegocio, direccion, latitud y longitud',
        );
      }
    }

    const hash = await hashearContrasena(dto.contrasena);

    const usuario = await this.prisma.$transaction(async (tx) => {
      const creado = await tx.usuario.create({
        data: {
          email: dto.email,
          telefono: dto.telefono,
          hashContrasena: hash,
          nombreCompleto: dto.nombreCompleto,
          rol: dto.rol,
          estado: 'PENDIENTE_VERIFICACION',
        },
      });

      if (dto.rol === RolRegistrable.VENDEDOR) {
        await tx.perfilVendedor.create({
          data: {
            usuarioId: creado.id,
            nombreNegocio: dto.nombreNegocio!,
            direccion: dto.direccion!,
            latitud: dto.latitud!,
            longitud: dto.longitud!,
          },
        });
      }

      return creado;
    });

    return this.emitirPar(usuario, contexto);
  }

  async iniciarSesion(
    dto: IniciarSesionDto,
    contexto: ContextoPeticion = {},
  ): Promise<RespuestaAutenticacionDto> {
    const usuario = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
    if (!usuario) throw new UnauthorizedException('Credenciales inválidas');

    const coincide = await compararContrasena(dto.contrasena, usuario.hashContrasena);
    if (!coincide) throw new UnauthorizedException('Credenciales inválidas');

    if (usuario.estado === 'SUSPENDIDO' || usuario.estado === 'INACTIVO') {
      throw new UnauthorizedException('La cuenta no está activa');
    }

    const actualizado = await this.prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimoIngresoEn: new Date() },
      include: { perfilAdmin: true, perfilVendedor: true, perfilRepartidor: true },
    });

    return this.emitirPar(actualizado, contexto);
  }

  async refrescar(
    dto: RefrescarDto,
    contexto: ContextoPeticion = {},
  ): Promise<RespuestaAutenticacionDto> {
    let payload: PayloadRefresco;
    try {
      payload = await this.jwtService.verifyAsync<PayloadRefresco>(dto.tokenRefresco, {
        secret: process.env.JWT_REFRESH_SECRET as string,
      });
    } catch {
      throw new UnauthorizedException('Token de refresco inválido');
    }

    const registro = await this.prisma.tokenRefresco.findUnique({
      where: { token: dto.tokenRefresco },
    });
    if (!registro || registro.revocadoEn || registro.expiraEn <= new Date()) {
      throw new UnauthorizedException('Token de refresco inválido');
    }
    if (registro.usuarioId !== payload.sub) {
      throw new UnauthorizedException('Token de refresco inválido');
    }

    const usuario = await this.prisma.usuario.findUnique({ where: { id: payload.sub } });
    if (!usuario || usuario.estado === 'SUSPENDIDO' || usuario.estado === 'INACTIVO') {
      throw new UnauthorizedException('Usuario no autorizado');
    }

    await this.prisma.tokenRefresco.update({
      where: { id: registro.id },
      data: { revocadoEn: new Date() },
    });

    return this.emitirPar(usuario, contexto);
  }

  async cerrarSesion(usuarioId: string, dto: CerrarSesionDto): Promise<void> {
    const registro = await this.prisma.tokenRefresco.findUnique({
      where: { token: dto.tokenRefresco },
    });
    if (!registro || registro.usuarioId !== usuarioId) {
      // No revelamos si el token existe o pertenece a otro usuario.
      return;
    }
    if (registro.revocadoEn) return;

    await this.prisma.tokenRefresco.update({
      where: { id: registro.id },
      data: { revocadoEn: new Date() },
    });
  }

  private async emitirPar(
    usuario: any,
    contexto: ContextoPeticion,
  ): Promise<RespuestaAutenticacionDto> {
    const tokenAcceso = await this.jwtService.signAsync(
      { sub: usuario.id, rol: usuario.rol },
      {
        secret: process.env.JWT_ACCESS_SECRET as string,
        expiresIn: (process.env.JWT_ACCESS_EXPIRES ?? '15m') as unknown as number,
      },
    );

    const jti = randomUUID();
    const tokenRefresco = await this.jwtService.signAsync(
      { sub: usuario.id, jti },
      {
        secret: process.env.JWT_REFRESH_SECRET as string,
        expiresIn: (process.env.JWT_REFRESH_EXPIRES ?? '7d') as unknown as number,
      },
    );

    const expiraEn = this.calcularExpiracion(process.env.JWT_REFRESH_EXPIRES ?? '7d');

    await this.prisma.tokenRefresco.create({
      data: {
        usuarioId: usuario.id,
        token: tokenRefresco,
        expiraEn,
        userAgent: contexto.userAgent ?? null,
        direccionIp: contexto.direccionIp ?? null,
      },
    });

    return {
      usuario: UsuarioPublicoDto.desde(usuario),
      tokenAcceso,
      tokenRefresco,
    };
  }

  private calcularExpiracion(expresion: string): Date {
    const match = /^(\d+)([smhd])$/.exec(expresion);
    if (!match) {
      // Si el formato no es reconocible, se asume 7 días.
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
    const valor = Number(match[1]);
    const factores = { s: 1_000, m: 60_000, h: 3_600_000, d: 86_400_000 } as const;
    const factor = factores[match[2] as keyof typeof factores];
    return new Date(Date.now() + valor * factor);
  }
}
