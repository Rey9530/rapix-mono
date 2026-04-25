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
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../comun/decoradores/roles.decorador.js';
import { UsuarioActual } from '../../comun/decoradores/usuario-actual.decorador.js';
import type { Usuario } from '../../generated/prisma/client.js';
import { ActualizarPaqueteDto } from './dto/actualizar-paquete.dto.js';
import { ComprarPaqueteDto } from './dto/comprar-paquete.dto.js';
import { FiltrosPaqueteDto } from './dto/filtros-paquete.dto.js';
import { PaquetesRecargadosServicio } from './paquetes-recargados.servicio.js';

@ApiTags('Paquetes Recargados')
@ApiBearerAuth('autenticacion-jwt')
@Controller('paquetes-recargados')
export class PaquetesRecargadosControlador {
  constructor(private readonly servicio: PaquetesRecargadosServicio) {}

  // ─── Catálogo (autenticado) ───────────────────────────────────────

  @Get('disponibles')
  @ApiOperation({ summary: 'Catálogo de paquetes disponibles para compra' })
  disponibles() {
    return this.servicio.listarDisponibles();
  }

  // ─── Vendedor — rutas estáticas antes que /:id ────────────────────

  @Roles('VENDEDOR')
  @Post('comprar')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Comprar un paquete prepago' })
  comprar(@UsuarioActual() usuario: Usuario, @Body() dto: ComprarPaqueteDto) {
    return this.servicio.comprar(usuario, dto);
  }

  @Roles('VENDEDOR')
  @Get('yo')
  @ApiOperation({ summary: 'Paquetes del vendedor autenticado (paginado)' })
  listarYo(@UsuarioActual() usuario: Usuario, @Query() filtros: FiltrosPaqueteDto) {
    return this.servicio.listarYo(usuario, filtros);
  }

  @Roles('VENDEDOR')
  @Get('yo/saldo')
  @ApiOperation({ summary: 'Saldo prepagado total del vendedor' })
  saldo(@UsuarioActual() usuario: Usuario) {
    return this.servicio.saldo(usuario);
  }

  // ─── Admin ────────────────────────────────────────────────────────

  @Roles('ADMIN')
  @Get()
  @ApiOperation({ summary: 'Listado global con filtros (ADMIN)' })
  listarAdmin(@Query() filtros: FiltrosPaqueteDto) {
    return this.servicio.listarAdmin(filtros);
  }

  @Roles('ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Cambiar estado del paquete (confirmar pago, cancelar)' })
  cambiarEstado(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActualizarPaqueteDto,
  ) {
    return this.servicio.cambiarEstado(id, dto);
  }
}
