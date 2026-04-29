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
import { ActualizarReglaTarifaDto } from './dto/actualizar-regla-tarifa.dto.js';
import { CrearReglaTarifaDto } from './dto/crear-regla-tarifa.dto.js';
import { FiltrosReglaTarifaDto } from './dto/filtros-regla-tarifa.dto.js';
import { ReglasTarifaServicio } from './reglas-tarifa.servicio.js';

@ApiTags('Reglas de Tarifa')
@ApiBearerAuth('autenticacion-jwt')
@Roles('ADMIN')
@Controller('reglas-tarifa')
export class ReglasTarifaControlador {
  constructor(private readonly servicio: ReglasTarifaServicio) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear regla de tarifa (ADMIN)' })
  crear(@UsuarioActual() usuario: Usuario, @Body() dto: CrearReglaTarifaDto) {
    return this.servicio.crear(dto, usuario.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar reglas de tarifa con filtros y paginación' })
  listar(@Query() filtros: FiltrosReglaTarifaDto) {
    return this.servicio.listar(filtros);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener regla de tarifa por id' })
  obtenerPorId(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicio.obtenerPorId(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar regla de tarifa' })
  actualizar(
    @UsuarioActual() usuario: Usuario,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActualizarReglaTarifaDto,
  ) {
    return this.servicio.actualizar(id, dto, usuario.id);
  }

  @Patch(':id/desactivar')
  @ApiOperation({ summary: 'Desactivar regla de tarifa (soft delete)' })
  desactivar(
    @UsuarioActual() usuario: Usuario,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.servicio.desactivar(id, usuario.id);
  }

  @Patch(':id/activar')
  @ApiOperation({ summary: 'Reactivar regla de tarifa' })
  activar(
    @UsuarioActual() usuario: Usuario,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.servicio.activar(id, usuario.id);
  }
}
