import { Module } from '@nestjs/common';
import { EmailAdaptador } from './canales/email.adaptador.js';
import { PushAdaptador } from './canales/push.adaptador.js';
import { WhatsAppAdaptador } from './canales/whatsapp.adaptador.js';
import { CierreEventosManejador } from './manejadores/cierre-eventos.manejador.js';
import { PaqueteEventosManejador } from './manejadores/paquete-eventos.manejador.js';
import { PedidoEventosManejador } from './manejadores/pedido-eventos.manejador.js';
import { NotificacionesControlador } from './notificaciones.controlador.js';
import { NotificacionesServicio } from './notificaciones.servicio.js';
import { TokensDispositivoControlador } from './tokens-dispositivo.controlador.js';
import { TokensDispositivoServicio } from './tokens-dispositivo.servicio.js';

@Module({
  controllers: [NotificacionesControlador, TokensDispositivoControlador],
  providers: [
    NotificacionesServicio,
    TokensDispositivoServicio,
    PushAdaptador,
    WhatsAppAdaptador,
    EmailAdaptador,
    PedidoEventosManejador,
    CierreEventosManejador,
    PaqueteEventosManejador,
  ],
  exports: [NotificacionesServicio],
})
export class NotificacionesModulo {}
