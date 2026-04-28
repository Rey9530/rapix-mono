import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError } from 'axios';

const TIMEOUT_MS = 6000;

const PATRONES_COORDENADAS: ReadonlyArray<RegExp> = [
  /@(-?\d+\.\d+),(-?\d+\.\d+)/,
  /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,
  /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/,
  /[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/,
];

@Injectable()
export class GoogleMapsServicio {
  private readonly logger = new Logger(GoogleMapsServicio.name);

  async resolverCoordenadas(
    url: string,
  ): Promise<{ lat: number; lng: number }> {
    const urlLarga = await this.expandirUrlCorta(url);
    const coords = this.extraerCoordenadas(urlLarga);
    if (!coords) {
      this.logger.warn(
        `No se pudieron extraer coordenadas de la URL expandida: ${urlLarga}`,
      );
      throw new BadRequestException({
        codigo: 'PEDIDO_URL_MAPAS_INVALIDA',
        mensaje:
          'No se pudieron extraer coordenadas de la URL de Google Maps',
      });
    }
    return coords;
  }

  private async expandirUrlCorta(url: string): Promise<string> {
    try {
      const respuesta = await axios.get(url, {
        timeout: TIMEOUT_MS,
        maxRedirects: 0,
        validateStatus: (s) => s >= 200 && s < 400,
      });
      const location = respuesta.headers['location'];
      if (typeof location === 'string' && location.length > 0) {
        return location;
      }
      throw new BadRequestException({
        codigo: 'PEDIDO_URL_MAPAS_INVALIDA',
        mensaje:
          'La URL de Google Maps no devolvió una redirección esperada',
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      const ax = error as AxiosError;
      this.logger.warn(
        `Falló la expansión de URL corta de Google Maps: ${ax.message}`,
      );
      throw new BadRequestException({
        codigo: 'PEDIDO_URL_MAPAS_INVALIDA',
        mensaje: 'No se pudo resolver la URL de Google Maps',
      });
    }
  }

  private extraerCoordenadas(
    url: string,
  ): { lat: number; lng: number } | null {
    const decodificada = decodeURIComponent(url);
    for (const patron of PATRONES_COORDENADAS) {
      const match = decodificada.match(patron);
      if (!match) continue;
      const lat = Number(match[1]);
      const lng = Number(match[2]);
      if (
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
      ) {
        return { lat, lng };
      }
    }
    return null;
  }
}
