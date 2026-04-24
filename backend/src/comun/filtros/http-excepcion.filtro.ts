import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class HttpExcepcionFiltro implements ExceptionFilter {
  private readonly logger = new Logger(HttpExcepcionFiltro.name);

  catch(excepcion: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const respuesta = ctx.getResponse<Response>();
    const peticion = ctx.getRequest<Request>();

    const estado =
      excepcion instanceof HttpException
        ? excepcion.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const cuerpo =
      excepcion instanceof HttpException
        ? excepcion.getResponse()
        : { codigo: 'ERROR_INTERNO', mensaje: 'Error interno del servidor' };

    if (estado >= 500) {
      this.logger.error(
        `[${peticion.method}] ${peticion.url} — ${JSON.stringify(cuerpo)}`,
        excepcion instanceof Error ? excepcion.stack : undefined,
      );
    }

    respuesta.status(estado).json({
      estado,
      ruta: peticion.url,
      marcaTiempo: new Date().toISOString(),
      ...(typeof cuerpo === 'object' ? cuerpo : { mensaje: cuerpo }),
    });
  }
}
