import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import type { WAMessage, WASocket } from 'baileys';
import { EventosDominio } from '../../../eventos/eventos-dominio.js';
import type { ChatWhatsapp } from '../../../generated/prisma/client.js';
import { PrismaServicio } from '../../../prisma/prisma.servicio.js';
import {
  jidEsGrupo,
  normalizarChat,
  normalizarContacto,
  normalizarMensaje,
  tipoChatDeJid,
} from '../transformadores/baileys-a-dto.js';
import { WhatsappChatServicio } from './whatsapp-chat.servicio.js';
import { WhatsappContactoServicio } from './whatsapp-contacto.servicio.js';
import { WhatsappMensajeServicio } from './whatsapp-mensaje.servicio.js';

/**
 * Suscriptor unico de los eventos del socket Baileys. Se re-suscribe cada vez
 * que `WhatsappConexionServicio` emite `whatsapp.socket_creado`.
 *
 * Persiste contactos, chats, mensajes y reacciones, y emite eventos de dominio
 * para que el gateway los reemita por WebSocket al panel admin.
 */
@Injectable()
export class WhatsappEventoServicio {
  private readonly logger = new Logger(WhatsappEventoServicio.name);
  private socketSuscrito: WASocket | null = null;

  constructor(
    private readonly prisma: PrismaServicio,
    private readonly chats: WhatsappChatServicio,
    private readonly contactos: WhatsappContactoServicio,
    private readonly mensajes: WhatsappMensajeServicio,
    private readonly eventos: EventEmitter2,
  ) {}

  @OnEvent(EventosDominio.WhatsappSocketCreado)
  alCrearseSocket(payload: { socket: WASocket }): void {
    this.suscribir(payload.socket);
  }

  private suscribir(socket: WASocket): void {
    if (this.socketSuscrito === socket) return;
    this.socketSuscrito = socket;

    socket.ev.on('messages.upsert', ({ messages, type }) => {
      void this.alRecibirMensajes(messages, type).catch((error) => {
        this.logger.error(
          `messages.upsert error: ${error instanceof Error ? error.message : String(error)}`,
        );
      });
    });

    socket.ev.on('messages.update', (updates) => {
      void this.alActualizarMensajes(updates).catch((error) => {
        this.logger.error(
          `messages.update error: ${error instanceof Error ? error.message : String(error)}`,
        );
      });
    });

    socket.ev.on('messages.reaction', (reacciones) => {
      void this.alReaccionar(reacciones).catch((error) => {
        this.logger.error(
          `messages.reaction error: ${error instanceof Error ? error.message : String(error)}`,
        );
      });
    });

    socket.ev.on('chats.upsert', (chats) => {
      void this.alUpsertChats(chats).catch((error) => {
        this.logger.error(
          `chats.upsert error: ${error instanceof Error ? error.message : String(error)}`,
        );
      });
    });

    socket.ev.on('contacts.upsert', (contactos) => {
      void this.alUpsertContactos(contactos).catch((error) => {
        this.logger.error(
          `contacts.upsert error: ${error instanceof Error ? error.message : String(error)}`,
        );
      });
    });

    this.logger.log('Suscrito a eventos del socket Baileys.');
  }

  // ──────────────────────────────────────────────────
  // Handlers
  // ──────────────────────────────────────────────────

  private async alRecibirMensajes(
    mensajes: WAMessage[],
    _tipo: 'append' | 'notify' | 'prepend' | string,
  ): Promise<void> {
    for (const wa of mensajes) {
      const normalizado = normalizarMensaje(wa);
      if (!normalizado) continue;

      // Asegurar chat
      const nombreChat = wa.pushName ?? null;
      const chat = await this.chats.asegurarPorJid(
        normalizado.chatJid,
        nombreChat,
      );

      // Asegurar remitente (si aplica)
      let remitenteId: string | null = null;
      if (normalizado.remitenteJid) {
        const remitente = await this.contactos.asegurarPorJid(
          normalizado.remitenteJid,
          wa.pushName ?? null,
        );
        remitenteId = remitente.id;
      }

      // Persistir mensaje (idempotente)
      const { mensaje, esNuevo } = await this.mensajes.persistirEntrante({
        mensaje: normalizado,
        chatId: chat.id,
        remitenteId,
      });

      // Si es entrante nuevo, mover el chat al tope y aumentar no leidos
      if (esNuevo) {
        const fecha = mensaje.enviadoEn ?? mensaje.creadoEn;
        const chatActualizado = await this.chats.actualizarUltimoMensaje(
          chat.id,
          fecha,
          mensaje.id,
          normalizado.direccion === 'ENTRANTE',
        );
        this.eventos.emit(EventosDominio.WhatsappChatActualizado, {
          chat: chatActualizado,
        });
        this.eventos.emit(EventosDominio.WhatsappMensajeEntrante, {
          mensaje,
          chat: chatActualizado,
        });
      } else {
        this.eventos.emit(EventosDominio.WhatsappMensajeEntrante, {
          mensaje,
          chat,
        });
      }
    }
  }

  private async alActualizarMensajes(
    updates: Array<{
      key: { remoteJid?: string | null; id?: string | null };
      update: { status?: number | null };
    }>,
  ): Promise<void> {
    for (const { key, update } of updates) {
      if (!key.remoteJid || !key.id) continue;
      const chat = await this.prisma.chatWhatsapp.findUnique({
        where: { jid: key.remoteJid },
      });
      if (!chat) continue;
      const actualizado = await this.mensajes.actualizarEstadoPorExternoId(
        chat.id,
        key.id,
        update.status,
      );
      if (actualizado) {
        this.eventos.emit(EventosDominio.WhatsappMensajeEstado, {
          mensaje: actualizado,
        });
      }
    }
  }

  private async alReaccionar(
    reacciones: ReadonlyArray<unknown>,
  ): Promise<void> {
    for (const item of reacciones) {
      const r = item as {
        key?: { remoteJid?: string | null; id?: string | null };
        reaction?: {
          key?: { remoteJid?: string | null; id?: string | null } | null;
          text?: string | null;
        };
      };
      const remoteJid = r.key?.remoteJid;
      const externoId = r.key?.id;
      if (!remoteJid || !externoId) continue;

      const chat = await this.prisma.chatWhatsapp.findUnique({
        where: { jid: remoteJid },
      });
      if (!chat) continue;

      const mensaje = await this.prisma.mensajeWhatsapp.findUnique({
        where: { chatId_externoId: { chatId: chat.id, externoId } },
      });
      if (!mensaje) continue;

      const jidAutor = r.reaction?.key?.remoteJid ?? remoteJid;
      const emoji = r.reaction?.text ?? null;

      await this.mensajes.upsertReaccion(mensaje.id, jidAutor, emoji);
      this.eventos.emit(EventosDominio.WhatsappMensajeReaccion, {
        mensajeId: mensaje.id,
        chatId: chat.id,
        jidAutor,
        emoji,
      });
    }
  }

  private async alUpsertChats(chats: ReadonlyArray<unknown>): Promise<void> {
    for (const item of chats) {
      const c = item as {
        id?: string | null;
        name?: string | null;
        unreadCount?: number | null;
        conversationTimestamp?:
          | number
          | null
          | { toNumber: () => number };
      };
      if (!c.id) continue;
      const normalizado = normalizarChat({
        id: c.id,
        name: c.name,
        unreadCount: c.unreadCount,
        conversationTimestamp: c.conversationTimestamp,
      });
      const chat: ChatWhatsapp = await this.chats.upsertPorJid(normalizado);
      this.eventos.emit(EventosDominio.WhatsappChatActualizado, { chat });
    }
  }

  private async alUpsertContactos(
    contactos: ReadonlyArray<unknown>,
  ): Promise<void> {
    for (const item of contactos) {
      const contacto = item as {
        id?: string;
        lid?: string;
        phoneNumber?: string;
        name?: string;
        notify?: string;
        verifiedName?: string;
      };
      if (!contacto.id) continue;
      const normalizado = normalizarContacto(contacto as Parameters<typeof normalizarContacto>[0]);
      await this.contactos.upsertPorJid(normalizado);
      if (
        !jidEsGrupo(contacto.id) &&
        tipoChatDeJid(contacto.id) === 'INDIVIDUAL' &&
        normalizado.nombre
      ) {
        await this.prisma.chatWhatsapp.updateMany({
          where: { jid: contacto.id, nombre: null },
          data: { nombre: normalizado.nombre },
        });
      }
    }
  }
}

