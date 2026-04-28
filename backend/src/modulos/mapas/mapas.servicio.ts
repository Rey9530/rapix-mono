import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { createHash } from 'node:crypto';
import { RedisServicio } from '../../redis/redis.servicio.js';
import { OptimizarRutaDto, PuntoRutaDto } from './dto/optimizar-ruta.dto.js';
import { RespuestaRutaOptimizadaDto } from './dto/respuesta-ruta-optimizada.dto.js';

const MAPBOX_OPTIMIZATION_BASE =
  'https://api.mapbox.com/optimized-trips/v1/mapbox/driving';

const TTL_CACHE_SEGUNDOS = 5 * 60;

@Injectable()
export class MapasServicio {
  private readonly logger = new Logger(MapasServicio.name);

  constructor(private readonly redis: RedisServicio) {}

  async optimizarRuta(dto: OptimizarRutaDto): Promise<RespuestaRutaOptimizadaDto> {
    const token = process.env.MAPBOX_TOKEN;
    if (!token || token === 'pk.xxxxx') {
      throw new InternalServerErrorException(
        'MAPBOX_TOKEN no configurado en el backend',
      );
    }

    const claveCache = this.calcularClaveCache(dto.puntos);
    const cacheado = await this.leerCache(claveCache);
    if (cacheado) {
      return cacheado;
    }

    const coordenadas = dto.puntos
      .map((p) => `${p.longitud},${p.latitud}`)
      .join(';');

    const url = `${MAPBOX_OPTIMIZATION_BASE}/${coordenadas}`;

    try {
      const respuesta = await axios.get(url, {
        timeout: 8000,
        params: {
          access_token: token,
          geometries: 'polyline',
          overview: 'full',
          source: 'first',
          destination: 'last',
          roundtrip: false,
        },
      });

      const datos = respuesta.data;
      if (!datos || datos.code !== 'Ok' || !Array.isArray(datos.trips) || datos.trips.length === 0) {
        throw new BadGatewayException(
          `Respuesta inválida de Mapbox: ${datos?.code ?? 'desconocido'}`,
        );
      }

      const trip = datos.trips[0];
      const orden = (datos.waypoints ?? [])
        .map((w: any, idx: number) => ({ idx, orden: w.waypoint_index ?? idx }))
        .sort((a: { orden: number }, b: { orden: number }) => a.orden - b.orden)
        .map((w: { idx: number }) => w.idx);

      const resultado: RespuestaRutaOptimizadaDto = {
        geometriaPolyline: String(trip.geometry ?? ''),
        distanciaMetros: Number(trip.distance ?? 0),
        duracionSegundos: Number(trip.duration ?? 0),
        ordenWaypoints: orden,
      };

      await this.escribirCache(claveCache, resultado);
      return resultado;
    } catch (error) {
      if (error instanceof BadGatewayException || error instanceof InternalServerErrorException) {
        throw error;
      }
      if (error instanceof AxiosError) {
        this.logger.error(
          `Error llamando a Mapbox Optimization: ${error.message} (status=${error.response?.status})`,
        );
        throw new BadGatewayException(
          `Mapbox Optimization API falló: ${error.response?.status ?? 'sin status'}`,
        );
      }
      throw error;
    }
  }

  private calcularClaveCache(puntos: PuntoRutaDto[]): string {
    const normalizado = puntos
      .map((p) => `${p.latitud.toFixed(5)},${p.longitud.toFixed(5)}`)
      .join('|');
    const hash = createHash('sha256').update(normalizado).digest('hex').slice(0, 16);
    return `mapas:optimizar:${hash}`;
  }

  private async leerCache(clave: string): Promise<RespuestaRutaOptimizadaDto | null> {
    try {
      const valor = await this.redis.instancia.get(clave);
      if (!valor) return null;
      return JSON.parse(valor) as RespuestaRutaOptimizadaDto;
    } catch (error) {
      this.logger.warn(`No se pudo leer cache de Mapbox: ${(error as Error).message}`);
      return null;
    }
  }

  private async escribirCache(clave: string, valor: RespuestaRutaOptimizadaDto): Promise<void> {
    try {
      await this.redis.instancia.set(clave, JSON.stringify(valor), 'EX', TTL_CACHE_SEGUNDOS);
    } catch (error) {
      this.logger.warn(`No se pudo escribir cache de Mapbox: ${(error as Error).message}`);
    }
  }
}
