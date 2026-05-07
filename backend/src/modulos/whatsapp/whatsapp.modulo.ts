import { Module } from '@nestjs/common';
import { AutenticacionModulo } from '../autenticacion/autenticacion.modulo.js';
import { WhatsappBaileysAdaptador } from './adaptadores/whatsapp-baileys.adaptador.js';
import { WhatsappAuthStateServicio } from './servicios/whatsapp-auth-state.servicio.js';
import { WhatsappChatServicio } from './servicios/whatsapp-chat.servicio.js';
import { WhatsappConexionServicio } from './servicios/whatsapp-conexion.servicio.js';
import { WhatsappContactoServicio } from './servicios/whatsapp-contacto.servicio.js';
import { WhatsappEventoServicio } from './servicios/whatsapp-evento.servicio.js';
import { WhatsappMensajeServicio } from './servicios/whatsapp-mensaje.servicio.js';
import { WhatsappControlador } from './whatsapp.controlador.js';
import { WhatsappGateway } from './whatsapp.gateway.js';

/**
 * Modulo de WhatsApp (Baileys).
 *
 * Fase 1 — `WhatsappAuthStateServicio` (auth state en Postgres).
 * Fase 2 — `WhatsappConexionServicio` (singleton: makeWASocket, reconexion),
 *          controlador REST de sesion y `WhatsappGateway` (socket.io en
 *          namespace `/whatsapp`).
 * Fase 3 — `WhatsappEventoServicio` con handlers de baileys (mensajes, chats,
 *          contactos, reacciones, status), endpoints de listado.
 * Fase 4 — Envio de mensajes (texto, media, reaccion, marcar leido) con
 *          throttling.
 * Fase 5 — `WhatsappBaileysAdaptador` que reemplaza el adaptador Cloud API en
 *          `NotificacionesModulo`.
 */
@Module({
  imports: [AutenticacionModulo],
  controllers: [WhatsappControlador],
  providers: [
    WhatsappAuthStateServicio,
    WhatsappConexionServicio,
    WhatsappContactoServicio,
    WhatsappChatServicio,
    WhatsappMensajeServicio,
    WhatsappEventoServicio,
    WhatsappGateway,
    WhatsappBaileysAdaptador,
  ],
  exports: [
    WhatsappAuthStateServicio,
    WhatsappConexionServicio,
    WhatsappChatServicio,
    WhatsappMensajeServicio,
    WhatsappBaileysAdaptador,
  ],
})
export class WhatsappModulo {}
