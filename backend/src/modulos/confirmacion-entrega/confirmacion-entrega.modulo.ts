import { Module } from '@nestjs/common';
import { NotificacionesModulo } from '../notificaciones/notificaciones.modulo.js';
import { WhatsappModulo } from '../whatsapp/whatsapp.modulo.js';
import { ConfirmacionEntregaCronServicio } from './confirmacion-entrega-cron.servicio.js';
import { ConfirmacionEntregaListener } from './confirmacion-entrega.listener.js';
import { ConfirmacionEntregaServicio } from './confirmacion-entrega.servicio.js';
import { IaClasificadorServicio } from './ia-clasificador.servicio.js';

/**
 * Modulo de confirmacion de entrega por WhatsApp + IA.
 *
 * Flujo:
 * 1. Listener escucha `pedido.estado_cambiado` → si `hacia=RECOGIDO`,
 *    `ConfirmacionEntregaServicio.iniciarConversacion()` envia el primer
 *    mensaje al cliente y persiste la conversacion.
 * 2. Listener escucha `whatsapp.mensaje_entrante` → si el chat tiene
 *    conversacion activa, `procesarRespuesta()` clasifica con OpenAI,
 *    actualiza `Pedido.entregaConfirmada` + `notaRider`, y envia un mensaje
 *    de cierre o repregunta.
 * 3. Cron cada minuto barre conversaciones vencidas (1h sin respuesta) y
 *    notifica al vendedor por FCM.
 */
@Module({
  imports: [WhatsappModulo, NotificacionesModulo],
  providers: [
    ConfirmacionEntregaServicio,
    ConfirmacionEntregaListener,
    ConfirmacionEntregaCronServicio,
    IaClasificadorServicio,
  ],
  exports: [ConfirmacionEntregaServicio],
})
export class ConfirmacionEntregaModulo {}
