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

  // Distancia en metros entre dos puntos (Haversine, radio medio de la Tierra
  // 6 371 008.8 m). Aproximacion suficiente para validaciones de relocalizacion.
  distanciaHaversineMetros(
    a: { lat: number; lng: number },
    b: { lat: number; lng: number },
  ): number {
    const R = 6_371_008.8;
    const toRad = (g: number) => (g * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
  }
}
