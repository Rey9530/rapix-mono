import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsuarioActual } from '../../comun/decoradores/usuario-actual.decorador.js';
import type { Usuario } from '../../generated/prisma/client.js';
import { RegistrarTokenDispositivoDto } from './dto/registrar-token-dispositivo.dto.js';
import { TokensDispositivoServicio } from './tokens-dispositivo.servicio.js';

@ApiTags('Tokens de dispositivo (FCM)')
@ApiBearerAuth('autenticacion-jwt')
@Controller('tokens-dispositivo')
export class TokensDispositivoControlador {
  constructor(private readonly servicio: TokensDispositivoServicio) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registra (upsert) un token FCM del dispositivo del usuario' })
  registrar(@UsuarioActual() usuario: Usuario, @Body() dto: RegistrarTokenDispositivoDto) {
    return this.servicio.registrar(usuario, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista los tokens activos del usuario autenticado' })
  listar(@UsuarioActual() usuario: Usuario) {
    return this.servicio.listarActivos(usuario);
  }

  @Delete(':token')
  @ApiOperation({ summary: 'Revoca (soft-delete) un token del usuario autenticado' })
  revocar(@UsuarioActual() usuario: Usuario, @Param('token') token: string) {
    return this.servicio.revocar(usuario, token);
  }
}
