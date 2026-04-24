import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Publico } from '../../comun/decoradores/publico.decorador.js';
import { Roles } from '../../comun/decoradores/roles.decorador.js';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';
import { RedisServicio } from '../../redis/redis.servicio.js';

type EstadoDependencia = 'arriba' | 'abajo';

export interface RespuestaSalud {
  estado: 'ok' | 'degradado';
  tiempoActividad: number;
  bd: EstadoDependencia;
  redis: EstadoDependencia;
}

export interface RespuestaSaludOperativa extends RespuestaSalud {
  entorno: string;
  version: string;
  marcaTiempo: string;
}

@ApiTags('Salud')
@Controller('salud')
export class SaludControlador {
  constructor(
    private readonly prisma: PrismaServicio,
    private readonly redis: RedisServicio,
  ) {}

  @Publico()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Health check público (BD + Redis)' })
  async obtenerEstado(): Promise<RespuestaSalud> {
    return this.estadoBase();
  }

  @Roles('ADMIN')
  @ApiBearerAuth('autenticacion-jwt')
  @Get('operativa')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Health check extendido (ADMIN): entorno, versión, dependencias' })
  async obtenerEstadoOperativo(): Promise<RespuestaSaludOperativa> {
    const base = await this.estadoBase();
    return {
      ...base,
      entorno: process.env.NODE_ENV ?? 'development',
      version: process.env.npm_package_version ?? '1.0.0',
      marcaTiempo: new Date().toISOString(),
    };
  }

  private async estadoBase(): Promise<RespuestaSalud> {
    const [bd, redis] = await Promise.all([
      this.pingBd(),
      this.redis.ping(),
    ]);
    const degradado = !bd || !redis;
    return {
      estado: degradado ? 'degradado' : 'ok',
      tiempoActividad: Math.floor(process.uptime()),
      bd: bd ? 'arriba' : 'abajo',
      redis: redis ? 'arriba' : 'abajo',
    };
  }

  private async pingBd(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}
