import { Injectable, Logger } from '@nestjs/common';
import {
  CanalAdaptador,
  CanalNoConfiguradoError,
  ContextoEnvio,
} from '../../notificaciones/canales/canal.adaptador.js';
import { WhatsappChatServicio } from '../servicios/whatsapp-chat.servicio.js';
import { WhatsappConexionServicio } from '../servicios/whatsapp-conexion.servicio.js';
import { WhatsappContactoServicio } from '../servicios/whatsapp-contacto.servicio.js';
import { WhatsappMensajeServicio } from '../servicios/whatsapp-mensaje.servicio.js';

/**
 * Adaptador del canal `WHATSAPP` que usa Baileys (la sesion vinculada por el
 * panel admin) para enviar las notificaciones automaticas. Reemplaza al
 * adaptador anterior que iba contra Meta Cloud API.
 *
 * - `disponible()`: la sesion global debe estar `CONECTADA`.
 * - `enviar(ctx)`: extrae el telefono del usuario o de los datos de la
 *   notificacion, lo formatea a JID (`<numero>@s.whatsapp.net`), localiza/crea
 *   el contacto y el chat 1:1 en DB y delega en `WhatsappMensajeServicio`.
 *
 * El cuerpo del mensaje sigue el mismo formato que usaba Cloud API en el camino
 * "texto" (no plantilla): `${titulo}\n\n${cuerpo}`. Las plantillas Cloud API
 * parametrizadas (componentes con buttons, header, etc.) no aplican con Baileys
 * — se envia texto plano renderizado por las plantillas en `notificaciones/plantillas`.
 */
@Injectable()
export class WhatsappBaileysAdaptador implements CanalAdaptador {
  private readonly logger = new Logger(WhatsappBaileysAdaptador.name);

  constructor(
    private readonly conexion: WhatsappConexionServicio,
    private readonly chats: WhatsappChatServicio,
    private readonly contactos: WhatsappContactoServicio,
    private readonly mensajes: WhatsappMensajeServicio,
  ) {}

  disponible(): boolean {
    return this.conexion.estaConectada();
  }

  async enviar(ctx: ContextoEnvio): Promise<void> {
    if (!this.disponible()) {
      throw new CanalNoConfiguradoError('WHATSAPP');
    }
    const { notificacion, usuario } = ctx;
    const datos = (notificacion.datos as Record<string, unknown> | null) ?? {};
    const telefonoCrudo =
      (datos.telefono as string | undefined) ??
      usuario?.telefono ??
      notificacion.destino;
    if (!telefonoCrudo) {
      throw new Error('WHATSAPP_SIN_TELEFONO');
    }

    const numero = formatearE164(telefonoCrudo);
    if (!numero) {
      throw new Error('WHATSAPP_TELEFONO_INVALIDO');
    }
    const jid = `${numero}@s.whatsapp.net`;

    const nombre = usuario?.nombreCompleto ?? null;
    await this.contactos.asegurarPorJid(jid, nombre);
    const chat = await this.chats.asegurarPorJid(jid, nombre);

    const cuerpo = `${notificacion.titulo}\n\n${notificacion.cuerpo}`;
    await this.mensajes.enviarTexto({ chatId: chat.id, texto: cuerpo });
  }
}

/**
 * Formatea un telefono a `E.164` sin signo `+` (ej. `50312345678`).
 * Devuelve `null` si la cadena no contiene digitos suficientes.
 */
function formatearE164(telefono: string): string | null {
  const limpio = telefono.replace(/[^\d+]/g, '');
  const sinMas = limpio.startsWith('+') ? limpio.slice(1) : limpio;
  if (!/^\d{8,15}$/.test(sinMas)) return null;
  return sinMas;
}
