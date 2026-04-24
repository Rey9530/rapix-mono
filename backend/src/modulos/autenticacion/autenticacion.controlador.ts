import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { Publico } from '../../comun/decoradores/publico.decorador.js';
import { UsuarioActual } from '../../comun/decoradores/usuario-actual.decorador.js';
import type { Usuario } from '../../generated/prisma/client.js';
import { AutenticacionServicio } from './autenticacion.servicio.js';
import { CerrarSesionDto } from './dto/cerrar-sesion.dto.js';
import { IniciarSesionDto } from './dto/iniciar-sesion.dto.js';
import { RefrescarDto } from './dto/refrescar.dto.js';
import { RegistrarDto } from './dto/registrar.dto.js';
import { RespuestaAutenticacionDto } from './dto/respuesta-autenticacion.dto.js';

@ApiTags('Autenticacion')
@Controller('autenticacion')
export class AutenticacionControlador {
  constructor(private readonly servicio: AutenticacionServicio) {}

  @Publico()
  @Post('registrar')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar un nuevo VENDEDOR o CLIENTE' })
  @ApiCreatedResponse({ type: RespuestaAutenticacionDto })
  registrar(
    @Body() dto: RegistrarDto,
    @Req() peticion: Request,
  ): Promise<RespuestaAutenticacionDto> {
    return this.servicio.registrar(dto, this.contextoDe(peticion));
  }

  @Publico()
  @Post('iniciar-sesion')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autentica con email/contraseña y emite par de tokens' })
  @ApiOkResponse({ type: RespuestaAutenticacionDto })
  iniciarSesion(
    @Body() dto: IniciarSesionDto,
    @Req() peticion: Request,
  ): Promise<RespuestaAutenticacionDto> {
    return this.servicio.iniciarSesion(dto, this.contextoDe(peticion));
  }

  @Publico()
  @Post('refrescar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Rota el refresh token: revoca el anterior y emite uno nuevo',
  })
  @ApiOkResponse({ type: RespuestaAutenticacionDto })
  refrescar(
    @Body() dto: RefrescarDto,
    @Req() peticion: Request,
  ): Promise<RespuestaAutenticacionDto> {
    return this.servicio.refrescar(dto, this.contextoDe(peticion));
  }

  @ApiBearerAuth('autenticacion-jwt')
  @Post('cerrar-sesion')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoca el refresh token proporcionado' })
  @ApiNoContentResponse()
  async cerrarSesion(
    @UsuarioActual() usuario: Usuario,
    @Body() dto: CerrarSesionDto,
  ): Promise<void> {
    await this.servicio.cerrarSesion(usuario.id, dto);
  }

  private contextoDe(peticion: Request) {
    return {
      userAgent: peticion.get('user-agent') ?? undefined,
      direccionIp: peticion.ip,
    };
  }
}
