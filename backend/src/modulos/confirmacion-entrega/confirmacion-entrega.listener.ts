import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventosDominio } from '../../eventos/eventos-dominio.js';
import { PedidoEstadoCambiadoEvento } from '../../eventos/pedido-estado-cambiado.evento.js';
import type {
  ChatWhatsapp,
  MensajeWhatsapp,
} from '../../generated/prisma/client.js';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';
import { ConfirmacionEntregaServicio } from './confirmacion-entrega.servicio.js';

interface EventoMensajeEntrante {
  mensaje: MensajeWhatsapp;
  chat: ChatWhatsapp;
}

@Injectable()
export class ConfirmacionEntregaListener {
  private readonly logger = new Logger(ConfirmacionEntregaListener.name);

  constructor(
    private readonly servicio: ConfirmacionEntregaServicio,
    private readonly prisma: PrismaServicio,
  ) {}

  @OnEvent(EventosDominio.PedidoEstadoCambiado, { async: true })
  async alCambiarEstadoPedido(evento: PedidoEstadoCambiadoEvento): Promise<void> {
    if (evento.hacia !== 'RECOGIDO') return;
    try {
      await this.servicio.iniciarConversacion(evento.pedidoId);
    } catch (error) {
      this.logger.error(
        `Fallo iniciando conversacion para pedido ${evento.pedidoId}: ${(error as Error).message}`,
      );
    }
  }

  @OnEvent(EventosDominio.WhatsappMensajeEntrante, { async: true })
  async alMensajeEntrante(evento: EventoMensajeEntrante): Promise<void> {
    // Filtro critico: el mismo evento se emite tambien para nuestros mensajes
    // SALIENTES (ver whatsapp-mensaje.servicio.ts). Si no filtramos aqui, la
    // IA reclasificaria sus propias respuestas → loop infinito.
    if (evento.mensaje.direccion !== 'ENTRANTE') return;

    // Short-circuit: solo seguimos si hay conversacion activa para este chat.
    // Si el cliente tiene varios pedidos en curso al mismo numero, tomamos la
    // mas reciente — los mensajes del cliente normalmente responden a la
    // ultima pregunta que envio el bot.
    const activa = await this.prisma.confirmacionEntregaConversacion.findFirst({
      where: {
        chatId: evento.chat.id,
        estado: { in: ['INICIADA', 'REPREGUNTADA'] },
      },
      orderBy: { iniciadaEn: 'desc' },
      select: { id: true },
    });
    if (!activa) {
      this.logger.debug(
        `Mensaje entrante ${evento.mensaje.id} (chat ${evento.chat.id}): sin conversacion activa.`,
      );
      return;
    }

    this.logger.log(
      `Despachando mensaje entrante ${evento.mensaje.id} a conversacion ${activa.id}.`,
    );
    try {
      await this.servicio.procesarRespuesta(evento.mensaje.id);
    } catch (error) {
      this.logger.error(
        `Fallo procesando respuesta entrante (mensaje ${evento.mensaje.id}): ${(error as Error).message}`,
      );
    }
  }
}
