import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventosDominio } from '../../../eventos/eventos-dominio.js';
import { VerificacionCorreoSolicitadaEvento } from '../../../eventos/verificacion-correo-solicitada.evento.js';
import { NotificacionesServicio } from '../notificaciones.servicio.js';

@Injectable()
export class VerificacionCorreoManejador {
  private readonly logger = new Logger(VerificacionCorreoManejador.name);

  constructor(private readonly notif: NotificacionesServicio) {}

  @OnEvent(EventosDominio.VerificacionCorreoSolicitada, { async: true })
  async alSolicitarVerificacion(
    evento: VerificacionCorreoSolicitadaEvento,
  ): Promise<void> {
    const horas = Math.max(
      1,
      Math.round((evento.expiraEn.getTime() - Date.now()) / (60 * 60 * 1000)),
    );

    const url = this.construirUrl(evento.tokenClaro);
    const cuerpo =
      `Hola ${evento.nombreCompleto},\n\n` +
      'Para verificar tu correo electrónico, haz clic en el siguiente enlace:\n\n' +
      `${url}\n\n` +
      `Este enlace expira en ${horas} horas. Si no fuiste tú quien solicitó esto, puedes ignorar este mensaje.`;

    try {
      await this.notif.enviar({
        usuarioId: evento.usuarioId,
        canal: 'EMAIL',
        titulo: 'Verifica tu correo electrónico',
        cuerpo,
        destino: evento.email,
      });
    } catch (err) {
      this.logger.error('Falló envío de correo de verificación', err as Error);
    }
  }

  private construirUrl(tokenClaro: string): string {
    const base = (process.env.URL_BASE_API ?? 'http://localhost:3000').replace(
      /\/$/,
      '',
    );
    const prefijo = (process.env.API_PREFIX ?? 'api/v1').replace(/^\/|\/$/g, '');
    return `${base}/${prefijo}/autenticacion/verificar-correo?token=${tokenClaro}`;
  }
}
