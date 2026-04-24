import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { Publico } from '../../comun/decoradores/publico.decorador.js';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';

class EstadoSaludDto {
  @ApiProperty({ example: 'ok', enum: ['ok', 'degraded'] })
  estado!: 'ok' | 'degraded';

  @ApiProperty({ example: '2026-04-23T05:41:00.000Z' })
  marcaTiempo!: string;

  @ApiProperty({ example: 12345, description: 'Uptime del proceso en segundos' })
  uptimeSegundos!: number;

  @ApiProperty({ example: '1.0.0' })
  version!: string;
}

class EstadoDependenciaDto {
  @ApiProperty({ example: 'arriba', enum: ['arriba', 'abajo'] })
  base_de_datos!: 'arriba' | 'abajo';
}

class SaludCompletaDto extends EstadoSaludDto {
  @ApiProperty({ type: EstadoDependenciaDto })
  dependencias!: EstadoDependenciaDto;
}

@ApiTags('Salud')
@Controller('salud')
export class SaludControlador {
  constructor(private readonly prisma: PrismaServicio) {}

  @Publico()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Estado general del servicio',
    description: 'Liveness probe — devuelve 200 si el proceso está corriendo.',
  })
  @ApiOkResponse({ type: EstadoSaludDto })
  obtenerEstado(): EstadoSaludDto {
    return {
      estado: 'ok',
      marcaTiempo: new Date().toISOString(),
      uptimeSegundos: Math.floor(process.uptime()),
      version: process.env.npm_package_version ?? '1.0.0',
    };
  }

  @Publico()
  @Get('completa')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Estado del servicio y dependencias',
    description: 'Readiness probe — verifica conectividad con la base de datos.',
  })
  @ApiOkResponse({ type: SaludCompletaDto })
  async obtenerEstadoCompleto(): Promise<SaludCompletaDto> {
    let baseDatos: 'arriba' | 'abajo' = 'arriba';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      baseDatos = 'abajo';
    }

    return {
      estado: baseDatos === 'arriba' ? 'ok' : 'degraded',
      marcaTiempo: new Date().toISOString(),
      uptimeSegundos: Math.floor(process.uptime()),
      version: process.env.npm_package_version ?? '1.0.0',
      dependencias: { base_de_datos: baseDatos },
    };
  }
}
