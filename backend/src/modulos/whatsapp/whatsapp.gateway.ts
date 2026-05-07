import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventosDominio } from '../../eventos/eventos-dominio.js';
import type {
  ChatWhatsapp,
  MensajeWhatsapp,
  SesionWhatsapp,
} from '../../generated/prisma/client.js';
import type { PayloadJwtAcceso } from '../autenticacion/estrategias/jwt.estrategia.js';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';
import { chatADto } from './transformadores/chat-a-dto.js';
import { mensajeADto } from './transformadores/mensaje-a-dto.js';
import { sesionADto } from './transformadores/sesion-a-dto.js';

const SALA_ADMINS = 'admins';

/**
 * Gateway WebSocket del modulo WhatsApp.
 *
 * - Namespace: `/whatsapp`
 * - Auth: JWT en `handshake.auth.token` (validado contra `JwtService`).
 *   Solo se aceptan usuarios con rol ADMIN.
 * - Emite eventos servidor → cliente: `sesion:estado`, `chat:upsert`,
 *   `mensaje:nuevo`, `mensaje:estado`, `mensaje:reaccion`.
 * - No acepta eventos cliente → servidor en MVP (todo inicia por REST).
 */
@WebSocketGateway({
  namespace: '/whatsapp',
  cors: { origin: true, credentials: true },
})
export class WhatsappGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(WhatsappGateway.name);

  @WebSocketServer()
  servidor!: Server;

  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaServicio,
  ) {}

  async handleConnection(cliente: Socket): Promise<void> {
    try {
      const token = this.extraerToken(cliente);
      if (!token) {
        this.logger.warn(`WS sin token; desconectando ${cliente.id}.`);
        cliente.disconnect(true);
        return;
      }
      const payload = await this.jwt.verifyAsync<PayloadJwtAcceso>(token, {
        secret: process.env.JWT_ACCESS_SECRET as string,
      });
      const usuario = await this.prisma.usuario.findUnique({
        where: { id: payload.sub },
        select: { rol: true, estado: true },
      });
      if (
        !usuario ||
        usuario.rol !== 'ADMIN' ||
        usuario.estado !== 'ACTIVO'
      ) {
        this.logger.warn(
          `WS rechazado (rol=${usuario?.rol ?? 'n/a'}, estado=${usuario?.estado ?? 'n/a'}).`,
        );
        cliente.disconnect(true);
        return;
      }
      cliente.data.usuarioId = payload.sub;
      await cliente.join(SALA_ADMINS);
      // Estado inicial al conectar: util para reconexiones.
      const sesion = await this.prisma.sesionWhatsapp.findUnique({
        where: { id: 'global' },
      });
      if (sesion) {
        cliente.emit('sesion:estado', sesionADto(sesion));
      }
    } catch (error) {
      this.logger.warn(
        `WS auth fallo: ${error instanceof Error ? error.message : String(error)}`,
      );
      cliente.disconnect(true);
    }
  }

  handleDisconnect(cliente: Socket): void {
    if (cliente.data?.usuarioId) {
      this.logger.debug(
        `WS desconectado usuarioId=${cliente.data.usuarioId} (${cliente.id}).`,
      );
    }
  }

  // ──────────────────────────────────────────────────
  // Re-emisores de eventos de dominio
  // ──────────────────────────────────────────────────

  @OnEvent(EventosDominio.WhatsappEstadoCambiado, { async: true })
  alCambiarEstado(payload: { sesion: SesionWhatsapp }): void {
    this.servidor.to(SALA_ADMINS).emit('sesion:estado', sesionADto(payload.sesion));
  }

  @OnEvent(EventosDominio.WhatsappQrDisponible, { async: true })
  alGenerarseQr(payload: { sesion: SesionWhatsapp }): void {
    this.servidor.to(SALA_ADMINS).emit('sesion:estado', sesionADto(payload.sesion));
  }

  @OnEvent(EventosDominio.WhatsappChatActualizado, { async: true })
  alActualizarseChat(payload: { chat: ChatWhatsapp }): void {
    this.servidor.to(SALA_ADMINS).emit('chat:upsert', chatADto(payload.chat));
  }

  @OnEvent(EventosDominio.WhatsappMensajeEntrante, { async: true })
  alLlegarMensaje(payload: {
    mensaje: MensajeWhatsapp;
    chat: ChatWhatsapp;
  }): void {
    this.servidor.to(SALA_ADMINS).emit('mensaje:nuevo', mensajeADto(payload.mensaje));
  }

  @OnEvent(EventosDominio.WhatsappMensajeEstado, { async: true })
  alCambiarEstadoMensaje(payload: { mensaje: MensajeWhatsapp }): void {
    this.servidor.to(SALA_ADMINS).emit('mensaje:estado', {
      mensajeId: payload.mensaje.id,
      chatId: payload.mensaje.chatId,
      estado: payload.mensaje.estado,
      entregadoEn: payload.mensaje.entregadoEn?.toISOString() ?? null,
      leidoEn: payload.mensaje.leidoEn?.toISOString() ?? null,
    });
  }

  @OnEvent(EventosDominio.WhatsappMensajeReaccion, { async: true })
  alReaccionar(payload: {
    mensajeId: string;
    chatId: string;
    jidAutor: string;
    emoji: string | null;
  }): void {
    this.servidor.to(SALA_ADMINS).emit('mensaje:reaccion', payload);
  }

  // ──────────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────────

  private extraerToken(cliente: Socket): string | null {
    const auth = cliente.handshake.auth as
      | { token?: unknown }
      | undefined;
    if (auth && typeof auth.token === 'string' && auth.token.trim() !== '') {
      return auth.token;
    }
    const authorization = cliente.handshake.headers.authorization;
    if (typeof authorization === 'string') {
      const partes = authorization.split(' ');
      if (partes.length === 2 && partes[0].toLowerCase() === 'bearer') {
        return partes[1];
      }
    }
    const queryToken = cliente.handshake.query.token;
    if (typeof queryToken === 'string') return queryToken;
    return null;
  }
}
