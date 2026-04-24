import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Roles } from '../../comun/decoradores/roles.decorador.js';
import { UsuarioActual } from '../../comun/decoradores/usuario-actual.decorador.js';
import type { Usuario } from '../../generated/prisma/client.js';
import { ActualizarDisponibilidadDto } from './dto/actualizar-disponibilidad.dto.js';
import { ActualizarUbicacionDto } from './dto/actualizar-ubicacion.dto.js';
import { RepartidoresServicio } from './repartidores.servicio.js';

@ApiTags('Repartidores')
@ApiBearerAuth('autenticacion-jwt')
@Controller('repartidores')
export class RepartidoresControlador {
  constructor(private readonly servicio: RepartidoresServicio) {}

  // ─── /yo (REPARTIDOR) — static routes antes que /:id ─────────────

  @Roles('REPARTIDOR')
  @Get('yo')
  @ApiOperation({ summary: 'Perfil del repartidor autenticado con zonas asignadas' })
  obtenerYo(@UsuarioActual() usuario: Usuario) {
    return this.servicio.obtenerYo(usuario.id);
  }

  @Roles('REPARTIDOR')
  @Patch('yo/disponibilidad')
  @ApiOperation({ summary: 'Cambiar disponibilidad propia (online/offline)' })
  cambiarDisponibilidad(
    @UsuarioActual() usuario: Usuario,
    @Body() dto: ActualizarDisponibilidadDto,
  ) {
    return this.servicio.cambiarDisponibilidad(usuario.id, dto.disponible);
  }

  @Roles('REPARTIDOR')
  @Throttle({ default: { limit: 120, ttl: 60_000 } })
  @Post('yo/ubicacion')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar ubicación (hasta 120 req/min)' })
  actualizarUbicacion(
    @UsuarioActual() usuario: Usuario,
    @Body() dto: ActualizarUbicacionDto,
  ) {
    return this.servicio.actualizarUbicacion(usuario.id, dto);
  }

  // Stubs — implementación real llega en Fase 3 al existir Pedido.
  @Roles('REPARTIDOR')
  @Get('yo/pedidos')
  @ApiOperation({ summary: 'Pedidos del repartidor (stub Fase 3)' })
  pedidosPropios() {
    return [];
  }

  @Roles('REPARTIDOR')
  @Get('yo/recogidas-pendientes')
  recogidasPendientes() {
    return [];
  }

  @Roles('REPARTIDOR')
  @Get('yo/entregas-pendientes')
  entregasPendientes() {
    return [];
  }

  // ─── Admin ────────────────────────────────────────────────────────

  @Roles('ADMIN')
  @Get()
  @ApiOperation({ summary: 'Lista de repartidores con zonas (ADMIN)' })
  listar() {
    return this.servicio.listar();
  }

  @Roles('ADMIN')
  @Get(':id/desempeno')
  @ApiOperation({ summary: 'Métricas de desempeño (ADMIN)' })
  desempeno(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicio.desempeno(id);
  }

  @Roles('ADMIN')
  @Get(':id/ubicacion')
  @ApiOperation({ summary: 'Última ubicación reportada (ADMIN)' })
  ubicacion(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicio.ubicacion(id);
  }
}
