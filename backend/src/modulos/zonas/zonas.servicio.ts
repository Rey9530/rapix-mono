import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { EstadoUsuario } from '../../generated/prisma/client.js';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';
import { ActualizarZonaDto } from './dto/actualizar-zona.dto.js';
import { AsignarRepartidoresAZonaDto } from './dto/asignar-repartidores.dto.js';
import {
  CoberturaVendedoresDto,
  PuntoIntercambioEnCoberturaDto,
  VendedorEnCoberturaDto,
} from './dto/cobertura-vendedores.dto.js';
import { CrearZonaDto } from './dto/crear-zona.dto.js';
import { PuntoGeoDto } from './dto/punto-geo.dto.js';
import { ZonaDto } from './dto/zona.dto.js';

interface FilaZonaCruda {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  poligono_geojson: string;
  latitudCentro: number;
  longitudCentro: number;
  puntoIntercambioId: string | null;
  activa: boolean;
  creadoEn: Date;
  actualizadoEn: Date;
}

@Injectable()
export class ZonasServicio {
  constructor(private readonly prisma: PrismaServicio) {}

  /**
   * Convierte el array [{lat,lng}, ...] al GeoJSON `Polygon` que PostGIS
   * acepta vía `ST_GeomFromGeoJSON`. Cierra el anillo si no venía cerrado.
   * Nota GeoJSON: coordenadas en orden [longitud, latitud].
   */
  static convertirAPoligonoGeoJson(puntos: PuntoGeoDto[]): object {
    if (!puntos || puntos.length < 3) {
      throw new BadRequestException('El polígono requiere al menos 3 puntos.');
    }
    const coordenadas = puntos.map((p) => [p.lng, p.lat]);
    const primero = coordenadas[0];
    const ultimo = coordenadas[coordenadas.length - 1];
    if (primero[0] !== ultimo[0] || primero[1] !== ultimo[1]) {
      coordenadas.push([primero[0], primero[1]]);
    }
    return { type: 'Polygon', coordinates: [coordenadas] };
  }

  private static mapearFila(fila: FilaZonaCruda): ZonaDto {
    const geo = JSON.parse(fila.poligono_geojson) as {
      coordinates: number[][][];
    };
    const anillo = geo.coordinates[0] ?? [];
    // Soltamos el último punto (idéntico al primero) al devolver al cliente.
    const abierto = anillo.length > 1 && anillo[0][0] === anillo[anillo.length - 1][0] && anillo[0][1] === anillo[anillo.length - 1][1]
      ? anillo.slice(0, -1)
      : anillo;
    return {
      id: fila.id,
      codigo: fila.codigo,
      nombre: fila.nombre,
      descripcion: fila.descripcion,
      poligono: abierto.map(([lng, lat]) => ({ lat, lng })),
      latitudCentro: fila.latitudCentro,
      longitudCentro: fila.longitudCentro,
      puntoIntercambioId: fila.puntoIntercambioId,
      activa: fila.activa,
      creadoEn: fila.creadoEn,
      actualizadoEn: fila.actualizadoEn,
    };
  }

  async listar(incluirInactivas = false): Promise<ZonaDto[]> {
    const filas = await this.prisma.$queryRawUnsafe<FilaZonaCruda[]>(
      `SELECT id, codigo, nombre, descripcion,
              ST_AsGeoJSON(poligono) AS poligono_geojson,
              "latitudCentro", "longitudCentro", "puntoIntercambioId", activa,
              "creadoEn", "actualizadoEn"
       FROM zonas
       ${incluirInactivas ? '' : 'WHERE activa = true'}
       ORDER BY codigo`,
    );
    return filas.map(ZonasServicio.mapearFila);
  }

  async obtenerPorId(id: string): Promise<ZonaDto> {
    const filas = await this.prisma.$queryRawUnsafe<FilaZonaCruda[]>(
      `SELECT id, codigo, nombre, descripcion,
              ST_AsGeoJSON(poligono) AS poligono_geojson,
              "latitudCentro", "longitudCentro", "puntoIntercambioId", activa,
              "creadoEn", "actualizadoEn"
       FROM zonas WHERE id = $1`,
      id,
    );
    if (filas.length === 0) throw new NotFoundException('Zona no encontrada');
    return ZonasServicio.mapearFila(filas[0]);
  }

  async crear(dto: CrearZonaDto): Promise<ZonaDto> {
    const existente = await this.prisma.zona.findUnique({ where: { codigo: dto.codigo } });
    if (existente) throw new ConflictException(`Ya existe una zona con código ${dto.codigo}`);

    if (dto.puntoIntercambioId) {
      const punto = await this.prisma.puntoIntercambio.findUnique({
        where: { id: dto.puntoIntercambioId },
      });
      if (!punto) throw new BadRequestException('puntoIntercambioId no existe');
    }

    const geoJson = ZonasServicio.convertirAPoligonoGeoJson(dto.poligono);
    const id = randomUUID();
    await this.prisma.$executeRawUnsafe(
      `INSERT INTO zonas (id, codigo, nombre, descripcion, poligono,
                          "latitudCentro", "longitudCentro", "puntoIntercambioId",
                          activa, "creadoEn", "actualizadoEn")
       VALUES ($1, $2, $3, $4,
               ST_SetSRID(ST_GeomFromGeoJSON($5), 4326),
               $6, $7, $8, true, NOW(), NOW())`,
      id,
      dto.codigo,
      dto.nombre,
      dto.descripcion ?? null,
      JSON.stringify(geoJson),
      dto.latitudCentro,
      dto.longitudCentro,
      dto.puntoIntercambioId ?? null,
    );
    return this.obtenerPorId(id);
  }

  async actualizar(id: string, dto: ActualizarZonaDto): Promise<ZonaDto> {
    const existente = await this.prisma.zona.findUnique({ where: { id } });
    if (!existente) throw new NotFoundException('Zona no encontrada');

    if (dto.puntoIntercambioId) {
      const punto = await this.prisma.puntoIntercambio.findUnique({
        where: { id: dto.puntoIntercambioId },
      });
      if (!punto) throw new BadRequestException('puntoIntercambioId no existe');
    }

    // Campos escalares vía Prisma.
    const datosEscalares: Record<string, unknown> = {};
    if (dto.nombre !== undefined) datosEscalares.nombre = dto.nombre;
    if (dto.descripcion !== undefined) datosEscalares.descripcion = dto.descripcion;
    if (dto.latitudCentro !== undefined) datosEscalares.latitudCentro = dto.latitudCentro;
    if (dto.longitudCentro !== undefined) datosEscalares.longitudCentro = dto.longitudCentro;
    if (dto.puntoIntercambioId !== undefined) datosEscalares.puntoIntercambioId = dto.puntoIntercambioId;
    if (dto.activa !== undefined) datosEscalares.activa = dto.activa;

    if (Object.keys(datosEscalares).length > 0) {
      await this.prisma.zona.update({ where: { id }, data: datosEscalares });
    }

    // Polígono vía raw si viene.
    if (dto.poligono) {
      const geoJson = ZonasServicio.convertirAPoligonoGeoJson(dto.poligono);
      await this.prisma.$executeRawUnsafe(
        `UPDATE zonas SET poligono = ST_SetSRID(ST_GeomFromGeoJSON($1), 4326),
                          "actualizadoEn" = NOW()
         WHERE id = $2`,
        JSON.stringify(geoJson),
        id,
      );
    }

    return this.obtenerPorId(id);
  }

  async eliminar(id: string): Promise<ZonaDto> {
    const existente = await this.prisma.zona.findUnique({ where: { id } });
    if (!existente) throw new NotFoundException('Zona no encontrada');
    if (!existente.activa) return this.obtenerPorId(id);

    await this.prisma.zona.update({ where: { id }, data: { activa: false } });
    return this.obtenerPorId(id);
  }

  async listarRepartidoresDeZona(zonaId: string) {
    const zona = await this.prisma.zona.findUnique({ where: { id: zonaId } });
    if (!zona) throw new NotFoundException('Zona no encontrada');

    const filas = await this.prisma.zonaRepartidor.findMany({
      where: { zonaId },
      include: { repartidor: { include: { usuario: true } } },
      orderBy: [{ esPrimaria: 'desc' }],
    });

    return filas.map((f) => ({
      id: f.repartidor.id,
      usuarioId: f.repartidor.usuarioId,
      nombreCompleto: f.repartidor.usuario.nombreCompleto,
      email: f.repartidor.usuario.email,
      estado: f.repartidor.usuario.estado,
      tipoVehiculo: f.repartidor.tipoVehiculo,
      placa: f.repartidor.placa,
      disponible: f.repartidor.disponible,
      calificacion: f.repartidor.calificacion,
      totalEntregas: f.repartidor.totalEntregas,
      esPrimaria: f.esPrimaria,
    }));
  }

  async asignarRepartidores(
    zonaId: string,
    dto: AsignarRepartidoresAZonaDto,
  ): Promise<{ asignados: number }> {
    const zona = await this.prisma.zona.findUnique({ where: { id: zonaId } });
    if (!zona) throw new NotFoundException('Zona no encontrada');

    const existentes = await this.prisma.perfilRepartidor.findMany({
      where: { id: { in: dto.repartidorIds } },
      select: { id: true },
    });
    if (existentes.length !== dto.repartidorIds.length) {
      throw new BadRequestException('Alguno de los repartidorIds no existe');
    }

    if (
      dto.repartidorPrimarioId &&
      !dto.repartidorIds.includes(dto.repartidorPrimarioId)
    ) {
      throw new BadRequestException(
        'repartidorPrimarioId debe estar incluido en repartidorIds',
      );
    }

    await this.prisma.$transaction(async (tx) => {
      for (const repartidorId of dto.repartidorIds) {
        const esPrimaria = dto.repartidorPrimarioId === repartidorId;
        await tx.zonaRepartidor.upsert({
          where: { repartidorId_zonaId: { repartidorId, zonaId } },
          update: { esPrimaria },
          create: { repartidorId, zonaId, esPrimaria },
        });
      }
      // Si hay un primario declarado, desmarcar el resto de la zona.
      if (dto.repartidorPrimarioId) {
        await tx.zonaRepartidor.updateMany({
          where: { zonaId, repartidorId: { not: dto.repartidorPrimarioId } },
          data: { esPrimaria: false },
        });
      }
    });

    return { asignados: dto.repartidorIds.length };
  }

  /**
   * Devuelve la zona junto con la lista de vendedores y, para cada uno,
   * si su ubicación cae dentro del polígono y a cuántos metros está del
   * centro de la zona. Útil para diagnóstico operativo.
   *
   * Si la zona no tiene polígono definido devuelve la zona con un array
   * vacío (no es un error; la cobertura no es aplicable).
   */
  async obtenerCoberturaVendedores(
    zonaId: string,
  ): Promise<CoberturaVendedoresDto> {
    const zona = await this.obtenerPorId(zonaId);

    if (!zona.poligono || zona.poligono.length < 3) {
      return { zona, vendedores: [], puntoIntercambio: null };
    }

    // PostGIS calcula dentroDeZona y distanciaAlCentroMetros.
    // - ST_MakePoint(x, y) espera (longitud, latitud).
    // - ST_Transform(..., 3857) proyecta a Web Mercator para que
    //   ST_Distance devuelva metros directamente.
    const filas = await this.prisma.$queryRawUnsafe<VendedorEnCoberturaDto[]>(
      `SELECT
         u.id                              AS "usuarioId",
         pv.id                             AS "perfilVendedorId",
         u."nombreCompleto"                AS "nombreCompleto",
         u.email                           AS "email",
         u.telefono                        AS "telefono",
         u.estado                          AS "estado",
         pv."nombreNegocio"                AS "nombreNegocio",
         pv.direccion                      AS "direccion",
         pv.latitud                        AS "latitud",
         pv.longitud                       AS "longitud",
         ST_Contains(
           z.poligono,
           ST_SetSRID(ST_MakePoint(pv.longitud, pv.latitud), 4326)
         )                                 AS "dentroDeZona",
         ST_Distance(
           ST_Transform(ST_SetSRID(ST_MakePoint(pv.longitud, pv.latitud), 4326), 3857),
           ST_Transform(ST_SetSRID(ST_MakePoint(z."longitudCentro", z."latitudCentro"), 4326), 3857)
         )                                 AS "distanciaAlCentroMetros"
       FROM zonas z
       CROSS JOIN perfiles_vendedor pv
       INNER JOIN usuarios u ON u.id = pv."usuarioId"
       WHERE z.id = $1
         AND u.rol = 'VENDEDOR'
       ORDER BY "dentroDeZona" DESC, "distanciaAlCentroMetros" ASC`,
      zonaId,
    );

    // Enriquecer el punto de intercambio (consulta barata, una fila).
    let puntoIntercambio: PuntoIntercambioEnCoberturaDto | null = null;
    if (zona.puntoIntercambioId) {
      const p = await this.prisma.puntoIntercambio.findUnique({
        where: { id: zona.puntoIntercambioId },
        select: { id: true, nombre: true, latitud: true, longitud: true },
      });
      if (p) puntoIntercambio = p;
    }

    return { zona, vendedores: filas, puntoIntercambio };
  }
}
