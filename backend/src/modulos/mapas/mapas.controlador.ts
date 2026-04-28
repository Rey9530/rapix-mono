import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Roles } from '../../comun/decoradores/roles.decorador.js';
import { OptimizarRutaDto } from './dto/optimizar-ruta.dto.js';
import { RespuestaRutaOptimizadaDto } from './dto/respuesta-ruta-optimizada.dto.js';
import { MapasServicio } from './mapas.servicio.js';

@ApiTags('Mapas')
@ApiBearerAuth('autenticacion-jwt')
@Controller('mapas')
export class MapasControlador {
  constructor(private readonly servicio: MapasServicio) {}

  @Roles('REPARTIDOR', 'ADMIN')
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  @Post('optimizar-ruta')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Optimiza la ruta de un conjunto de waypoints (proxy a Mapbox Optimization)',
  })
  optimizarRuta(@Body() dto: OptimizarRutaDto): Promise<RespuestaRutaOptimizadaDto> {
    return this.servicio.optimizarRuta(dto);
  }
}
