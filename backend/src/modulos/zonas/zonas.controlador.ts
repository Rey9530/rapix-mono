import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Publico } from '../../comun/decoradores/publico.decorador.js';
import { Roles } from '../../comun/decoradores/roles.decorador.js';
import { ActualizarZonaDto } from './dto/actualizar-zona.dto.js';
import { AsignarRepartidoresAZonaDto } from './dto/asignar-repartidores.dto.js';
import { CrearZonaDto } from './dto/crear-zona.dto.js';
import { ResolverZonaDto } from './dto/resolver-zona.dto.js';
import { ZonaDto } from './dto/zona.dto.js';
import { GeoServicio } from './geo.servicio.js';
import { ZonasServicio } from './zonas.servicio.js';

@ApiTags('Zonas')
@Controller('zonas')
export class ZonasControlador {
  constructor(
    private readonly servicio: ZonasServicio,
    private readonly geo: GeoServicio,
  ) {}

  @Publico()
  @Get()
  @ApiOperation({ summary: 'Listar zonas (activas por defecto)' })
  listar(
    @Query('incluirInactivas', new ParseBoolPipe({ optional: true }))
    incluirInactivas?: boolean,
  ): Promise<ZonaDto[]> {
    return this.servicio.listar(incluirInactivas ?? false);
  }

  // Route estática antes que /:id para no chocar.
  @Publico()
  @Get('resolver')
  @ApiOperation({ summary: 'Resuelve la zona activa que contiene el punto (lat, lng)' })
  async resolver(@Query() q: ResolverZonaDto) {
    return this.geo.resolverZonaOFallar(q.lat, q.lng);
  }

  @Publico()
  @Get(':id')
  @ApiOperation({ summary: 'Detalle de zona (incluye polígono)' })
  obtenerPorId(@Param('id', ParseUUIDPipe) id: string): Promise<ZonaDto> {
    return this.servicio.obtenerPorId(id);
  }

  @ApiBearerAuth('autenticacion-jwt')
  @Roles('ADMIN')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear zona (ADMIN)' })
  crear(@Body() dto: CrearZonaDto): Promise<ZonaDto> {
    return this.servicio.crear(dto);
  }

  @ApiBearerAuth('autenticacion-jwt')
  @Roles('ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar zona (ADMIN)' })
  actualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActualizarZonaDto,
  ): Promise<ZonaDto> {
    return this.servicio.actualizar(id, dto);
  }

  @ApiBearerAuth('autenticacion-jwt')
  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete (activa=false)' })
  eliminar(@Param('id', ParseUUIDPipe) id: string): Promise<ZonaDto> {
    return this.servicio.eliminar(id);
  }

  @ApiBearerAuth('autenticacion-jwt')
  @Roles('ADMIN')
  @Post(':id/repartidores')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Asignar repartidores a la zona (reemplaza/actualiza)' })
  asignarRepartidores(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AsignarRepartidoresAZonaDto,
  ) {
    return this.servicio.asignarRepartidores(id, dto);
  }
}
