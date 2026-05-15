import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventosDominio } from '../../../eventos/eventos-dominio.js';
import { RecuperacionContrasenaSolicitadaEvento } from '../../../eventos/recuperacion-contrasena-solicitada.evento.js';
import { NotificacionesServicio } from '../notificaciones.servicio.js';

@Injectable()
export class RecuperacionContrasenaManejador {
  private readonly logger = new Logger(RecuperacionContrasenaManejador.name);

  constructor(private readonly notif: NotificacionesServicio) {}

  @OnEvent(EventosDominio.RecuperacionContrasenaSolicitada, { async: true })
  async alSolicitar(
    evento: RecuperacionContrasenaSolicitadaEvento,
  ): Promise<void> {
    const minutos = Math.max(
      1,
      Math.round((evento.expiraEn.getTime() - Date.now()) / 60_000),
    );

    const cuerpo =
      `Hola ${evento.nombreCompleto},\n\n` +
      'Recibimos una solicitud para restablecer tu contraseña en Rapix.\n\n' +
      `Tu código de verificación es: ${evento.codigo}\n\n` +
      `Este código expira en ${minutos} minutos. Si no fuiste tú quien lo solicitó, ` +
      'puedes ignorar este mensaje — tu contraseña no será modificada.';

    try {
      await this.notif.enviar({
        usuarioId: evento.usuarioId,
        canal: 'EMAIL',
        titulo: 'Código para restablecer tu contraseña',
        cuerpo,
        destino: evento.email,
      });
    } catch (err) {
      this.logger.error(
        'Falló envío de correo de recuperación de contraseña',
        err as Error,
      );
    }
  }
}
