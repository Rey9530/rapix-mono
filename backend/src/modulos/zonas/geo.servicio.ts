import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';

export interface ZonaResuelta {
  id: string;
  codigo: string;
  nombre: string;
}

export class PuntoFueraDeZona extends NotFoundException {
  constructor(lat: number, lng: number) {
    super({
      codigo: 'PUNTO_FUERA_DE_ZONA',
      mensaje: `No se encontró una zona activa que contenga el punto (${lat}, ${lng}).`,
    });
  }
}

@Injectable()
export class GeoServicio {
  constructor(private readonly prisma: PrismaServicio) {}

  async resolverZona(lat: number, lng: number): Promise<ZonaResuelta | null> {
    const filas = await this.prisma.$queryRawUnsafe<ZonaResuelta[]>(
      `SELECT id, codigo, nombre
       FROM zonas
       WHERE activa = true
         AND ST_Contains(poligono, ST_SetSRID(ST_MakePoint($1, $2), 4326))
       LIMIT 1`,
      lng,
      lat,
    );
    return filas[0] ?? null;
  }

  async resolverZonaOFallar(lat: number, lng: number): Promise<ZonaResuelta> {
    const zona = await this.resolverZona(lat, lng);
    if (!zona) throw new PuntoFueraDeZona(lat, lng);
    return zona;
  }
}
