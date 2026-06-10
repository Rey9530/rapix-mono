import { Injectable } from '@nestjs/common';
import type { AplicacionMovil, VersionApp } from '../../generated/prisma/client.js';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';
import { ActualizarVersionAppDto } from './dto/actualizar-version-app.dto.js';

export interface RespuestaVersionApp {
  aplicacion: AplicacionMovil;
  versionMinima: string;
}

@Injectable()
export class ConfiguracionServicio {
  constructor(private readonly prisma: PrismaServicio) {}

  /// Si la aplicación aún no tiene versión configurada, responde '0.0.0'
  /// para no bloquear a ningún cliente (fail-open).
  async obtenerVersionApp(
    aplicacion: AplicacionMovil,
  ): Promise<RespuestaVersionApp> {
    const registro = await this.prisma.versionApp.findUnique({
      where: { aplicacion },
    });
    return {
      aplicacion,
      versionMinima: registro?.versionMinima ?? '0.0.0',
    };
  }

  async actualizarVersionApp(
    aplicacion: AplicacionMovil,
    dto: ActualizarVersionAppDto,
  ): Promise<VersionApp> {
    return this.prisma.versionApp.upsert({
      where: { aplicacion },
      create: { aplicacion, versionMinima: dto.versionMinima },
      update: { versionMinima: dto.versionMinima },
    });
  }
}
