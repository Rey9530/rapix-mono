import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsuarioActual } from '../../comun/decoradores/usuario-actual.decorador.js';
import type { Usuario } from '../../generated/prisma/client.js';
import { FiltrosNotificacionDto } from './dto/filtros-notificacion.dto.js';
import { NotificacionesServicio } from './notificaciones.servicio.js';

@ApiTags('Notificaciones')
@ApiBearerAuth('autenticacion-jwt')
@Controller('notificaciones')
export class NotificacionesControlador {
  constructor(private readonly servicio: NotificacionesServicio) {}

  @Get('yo')
  @ApiOperation({ summary: 'Lista las notificaciones del usuario autenticado (paginado)' })
  listarYo(
    @UsuarioActual() usuario: Usuario,
    @Query() filtros: FiltrosNotificacionDto,
  ) {
    return this.servicio.listarMisNotificaciones(usuario, filtros);
  }

  @Patch(':id/leida')
  @ApiOperation({ summary: 'Marca una notificación propia como leída' })
  marcarLeida(
    @UsuarioActual() usuario: Usuario,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.servicio.marcarComoLeida(usuario, id);
  }
}
