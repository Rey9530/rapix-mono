import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { AnyMessageContent, WAMessage, WAMessageKey } from 'baileys';
import { EventosDominio } from '../../../eventos/eventos-dominio.js';
import type {
  EstadoMensajeWhatsapp,
  MensajeWhatsapp,
  Prisma,
  TipoMensajeWhatsapp,
} from '../../../generated/prisma/client.js';
import { PrismaServicio } from '../../../prisma/prisma.servicio.js';
import { ArchivosServicio } from '../../archivos/archivos.servicio.js';
import {
  MensajeNormalizado,
  mapearEstadoBaileys,
} from '../transformadores/baileys-a-dto.js';
import { LimitadorTasa } from '../utiles/limitador-tasa.js';
import { WhatsappConexionServicio } from './whatsapp-conexion.servicio.js';

interface PersistirMensajeParams {
  mensaje: MensajeNormalizado;
  chatId: string;
  remitenteId: string | null;
  estado?: EstadoMensajeWhatsapp;
}

interface PersistirMensajeResultado {
  mensaje: MensajeWhatsapp;
  esNuevo: boolean;
}

interface EnviarTextoParams {
  chatId: string;
  texto: string;
  respondeAId?: string;
}

interface EnviarMediaParams {
  chatId: string;
  archivo: { buffer: Buffer; mimetype: string; nombreOriginal?: string };
  tipo: 'IMAGEN' | 'VIDEO' | 'AUDIO' | 'DOCUMENTO';
  caption?: string;
  respondeAId?: string;
}

@Injectable()
export class WhatsappMensajeServicio {
  private readonly logger = new Logger(WhatsappMensajeServicio.name);
  private readonly limitador: LimitadorTasa;

  constructor(
    private readonly prisma: PrismaServicio,
    private readonly archivos: ArchivosServicio,
    private readonly conexion: WhatsappConexionServicio,
    private readonly eventos: EventEmitter2,
  ) {
    const tasa = Number(process.env.WHATSAPP_BAILEYS_TASA_MAX_POR_SEG ?? '1');
    const rafaga = Number(process.env.WHATSAPP_BAILEYS_RAFAGA_MAX ?? '5');
    this.limitador = new LimitadorTasa(rafaga, tasa);
  }

  // ──────────────────────────────────────────────────
  // Persistencia (usado por WhatsappEventoServicio)
  // ──────────────────────────────────────────────────

  async persistirEntrante(
    params: PersistirMensajeParams,
  ): Promise<PersistirMensajeResultado> {
    const existente = await this.prisma.mensajeWhatsapp.findUnique({
      where: {
        chatId_externoId: {
          chatId: params.chatId,
          externoId: params.mensaje.externoId,
        },
      },
    });

    const datos: Prisma.MensajeWhatsappUncheckedCreateInput = {
      externoId: params.mensaje.externoId,
      chatId: params.chatId,
      remitenteId: params.remitenteId,
      direccion: params.mensaje.direccion,
      tipo: params.mensaje.tipo,
      estado:
        params.estado ??
        (params.mensaje.direccion === 'ENTRANTE' ? 'ENTREGADO' : 'ENVIADO'),
      texto: params.mensaje.texto,
      caption: params.mensaje.caption,
      mimeMedia: params.mensaje.mimeMedia,
      bytesMedia: params.mensaje.bytesMedia,
      duracionSeg: params.mensaje.duracionSeg,
      nombreArchivo: params.mensaje.nombreArchivo,
      enviadoEn: params.mensaje.enviadoEn,
      payloadCrudo: params.mensaje.payloadCrudo as Prisma.InputJsonValue,
    };

    if (existente) {
      const mensaje = await this.prisma.mensajeWhatsapp.update({
        where: { id: existente.id },
        data: {
          tipo: datos.tipo,
          texto: datos.texto,
          caption: datos.caption,
          mimeMedia: datos.mimeMedia,
          bytesMedia: datos.bytesMedia,
          duracionSeg: datos.duracionSeg,
          nombreArchivo: datos.nombreArchivo,
          enviadoEn: datos.enviadoEn ?? undefined,
        },
      });
      return { mensaje, esNuevo: false };
    }

    const mensaje = await this.prisma.mensajeWhatsapp.create({ data: datos });
    return { mensaje, esNuevo: true };
  }

  async actualizarEstadoPorExternoId(
    chatId: string,
    externoId: string,
    statusBaileys: number | null | undefined,
  ): Promise<MensajeWhatsapp | null> {
    const estado = mapearEstadoBaileys(statusBaileys);
    if (!estado) return null;

    const existente = await this.prisma.mensajeWhatsapp.findUnique({
      where: { chatId_externoId: { chatId, externoId } },
    });
    if (!existente) return null;

    const ahora = new Date();
    const data: Prisma.MensajeWhatsappUncheckedUpdateInput = { estado };
    if (estado === 'ENTREGADO' && !existente.entregadoEn) {
      data.entregadoEn = ahora;
    }
    if (estado === 'LEIDO' && !existente.leidoEn) {
      data.leidoEn = ahora;
      if (!existente.entregadoEn) data.entregadoEn = ahora;
    }

    return this.prisma.mensajeWhatsapp.update({
      where: { id: existente.id },
      data,
    });
  }

  async listarPorChat(
    chatId: string,
    antesDe: Date | null,
    limite: number,
  ): Promise<MensajeWhatsapp[]> {
    return this.prisma.mensajeWhatsapp.findMany({
      where: {
        chatId,
        ...(antesDe ? { creadoEn: { lt: antesDe } } : {}),
      },
      orderBy: { creadoEn: 'desc' },
      take: Math.min(200, Math.max(1, Math.floor(limite))),
    });
  }

  async upsertReaccion(
    mensajeId: string,
    jidAutor: string,
    emoji: string | null,
  ): Promise<void> {
    if (emoji === null || emoji === '') {
      await this.prisma.reaccionMensajeWhatsapp.deleteMany({
        where: { mensajeId, jidAutor },
      });
      return;
    }
    await this.prisma.reaccionMensajeWhatsapp.upsert({
      where: { mensajeId_jidAutor: { mensajeId, jidAutor } },
      create: { mensajeId, jidAutor, emoji },
      update: { emoji, reaccionadoEn: new Date() },
    });
  }

  // ──────────────────────────────────────────────────
  // Envio
  // ──────────────────────────────────────────────────

  async enviarTexto(params: EnviarTextoParams): Promise<MensajeWhatsapp> {
    const chat = await this.cargarChat(params.chatId);
    const respondeA = await this.cargarRespondeA(params.respondeAId, chat.id);

    await this.limitador.obtenerToken();
    const sock = this.conexion.obtenerSocket();

    const contenido: AnyMessageContent = respondeA
      ? {
          text: params.texto,
        }
      : { text: params.texto };

    const opciones = respondeA
      ? { quoted: this.reconstruirComoQuoted(respondeA) }
      : undefined;

    const wa = await sock.sendMessage(chat.jid, contenido, opciones);
    if (!wa) {
      throw new Error('WHATSAPP_ENVIO_SIN_RESPUESTA');
    }

    const mensaje = await this.prisma.mensajeWhatsapp.create({
      data: {
        externoId: wa.key.id ?? `local-${Date.now()}`,
        chatId: chat.id,
        direccion: 'SALIENTE',
        tipo: 'TEXTO',
        estado: 'ENVIADO',
        texto: params.texto,
        respondeAId: respondeA?.id ?? null,
        enviadoEn: new Date(),
        payloadCrudo: wa as unknown as Prisma.InputJsonValue,
      },
    });

    const chatActualizado = await this.prisma.chatWhatsapp.update({
      where: { id: chat.id },
      data: {
        ultimoMensajeEn: mensaje.enviadoEn ?? mensaje.creadoEn,
        ultimoMensajeId: mensaje.id,
      },
    });

    this.eventos.emit(EventosDominio.WhatsappChatActualizado, {
      chat: chatActualizado,
    });
    this.eventos.emit(EventosDominio.WhatsappMensajeEntrante, {
      mensaje,
      chat: chatActualizado,
    });

    return mensaje;
  }

  async enviarMedia(params: EnviarMediaParams): Promise<MensajeWhatsapp> {
    const chat = await this.cargarChat(params.chatId);
    const respondeA = await this.cargarRespondeA(params.respondeAId, chat.id);

    const ext = extensionDeMime(params.archivo.mimetype);
    const key = ArchivosServicio.armarKeyWhatsapp(chat.id, ext);
    const subida = await this.archivos.subirParaWhatsapp(
      params.archivo.buffer,
      key,
      params.archivo.mimetype,
    );

    await this.limitador.obtenerToken();
    const sock = this.conexion.obtenerSocket();

    const contenido = construirContenidoMedia(
      params.tipo,
      params.archivo.buffer,
      params.archivo.mimetype,
      params.archivo.nombreOriginal,
      params.caption,
    );

    const opciones = respondeA
      ? { quoted: this.reconstruirComoQuoted(respondeA) }
      : undefined;

    const wa = await sock.sendMessage(chat.jid, contenido, opciones);
    if (!wa) {
      throw new Error('WHATSAPP_ENVIO_SIN_RESPUESTA');
    }

    const tipoEnum: TipoMensajeWhatsapp = params.tipo;

    const mensaje = await this.prisma.mensajeWhatsapp.create({
      data: {
        externoId: wa.key.id ?? `local-${Date.now()}`,
        chatId: chat.id,
        direccion: 'SALIENTE',
        tipo: tipoEnum,
        estado: 'ENVIADO',
        caption: params.caption ?? null,
        urlMedia: subida.url,
        mimeMedia: params.archivo.mimetype,
        bytesMedia: params.archivo.buffer.length,
        nombreArchivo: params.archivo.nombreOriginal ?? null,
        respondeAId: respondeA?.id ?? null,
        enviadoEn: new Date(),
        payloadCrudo: wa as unknown as Prisma.InputJsonValue,
      },
    });

    const chatActualizado = await this.prisma.chatWhatsapp.update({
      where: { id: chat.id },
      data: {
        ultimoMensajeEn: mensaje.enviadoEn ?? mensaje.creadoEn,
        ultimoMensajeId: mensaje.id,
      },
    });

    this.eventos.emit(EventosDominio.WhatsappChatActualizado, {
      chat: chatActualizado,
    });
    this.eventos.emit(EventosDominio.WhatsappMensajeEntrante, {
      mensaje,
      chat: chatActualizado,
    });

    return mensaje;
  }

  async reaccionarSaliente(
    chatId: string,
    mensajeId: string,
    emoji: string | null,
  ): Promise<void> {
    const chat = await this.cargarChat(chatId);
    const mensaje = await this.prisma.mensajeWhatsapp.findUnique({
      where: { id: mensajeId },
    });
    if (!mensaje || mensaje.chatId !== chat.id) {
      throw new NotFoundException('MENSAJE_NO_ENCONTRADO');
    }

    const key = this.reconstruirKeyDePayload(mensaje, chat.jid);

    await this.limitador.obtenerToken();
    const sock = this.conexion.obtenerSocket();
    await sock.sendMessage(chat.jid, {
      react: { text: emoji ?? '', key },
    });

    const sesion = await this.prisma.sesionWhatsapp.findUnique({
      where: { id: 'global' },
    });
    const jidAutor = sesion?.jidPropio ?? 'self';
    await this.upsertReaccion(mensaje.id, jidAutor, emoji);
    this.eventos.emit(EventosDominio.WhatsappMensajeReaccion, {
      mensajeId: mensaje.id,
      chatId: chat.id,
      jidAutor,
      emoji,
    });
  }

  async marcarLeido(chatId: string): Promise<{ noLeidos: 0 }> {
    const chat = await this.cargarChat(chatId);

    const noLeidos = await this.prisma.mensajeWhatsapp.findMany({
      where: {
        chatId: chat.id,
        direccion: 'ENTRANTE',
        leidoEn: null,
      },
      orderBy: { creadoEn: 'desc' },
      take: 200,
    });

    if (noLeidos.length > 0) {
      const sock = this.conexion.obtenerSocketOpcional();
      if (sock) {
        const keys: WAMessageKey[] = noLeidos
          .map((m) => this.reconstruirKeyDePayload(m, chat.jid))
          .filter((k): k is WAMessageKey => Boolean(k.id));
        try {
          await sock.readMessages(keys);
        } catch (error) {
          this.logger.warn(
            `readMessages fallo (ignorado): ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }
      await this.prisma.mensajeWhatsapp.updateMany({
        where: { id: { in: noLeidos.map((m) => m.id) } },
        data: { leidoEn: new Date(), estado: 'LEIDO' },
      });
    }

    await this.prisma.chatWhatsapp.update({
      where: { id: chat.id },
      data: { noLeidos: 0 },
    });

    return { noLeidos: 0 };
  }

  // ──────────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────────

  private async cargarChat(chatId: string) {
    const chat = await this.prisma.chatWhatsapp.findUnique({
      where: { id: chatId },
    });
    if (!chat) {
      throw new NotFoundException('CHAT_NO_ENCONTRADO');
    }
    return chat;
  }

  private async cargarRespondeA(
    respondeAId: string | undefined,
    chatId: string,
  ): Promise<MensajeWhatsapp | null> {
    if (!respondeAId) return null;
    const mensaje = await this.prisma.mensajeWhatsapp.findUnique({
      where: { id: respondeAId },
    });
    if (!mensaje || mensaje.chatId !== chatId) {
      throw new BadRequestException('MENSAJE_RESPONDE_A_INVALIDO');
    }
    return mensaje;
  }

  /**
   * Reconstruye el `WAMessage` para usarlo como `quoted` en una respuesta.
   * Tomamos el `payloadCrudo` original y lo pasamos tal cual.
   */
  private reconstruirComoQuoted(mensaje: MensajeWhatsapp): WAMessage {
    return mensaje.payloadCrudo as unknown as WAMessage;
  }

  private reconstruirKeyDePayload(
    mensaje: MensajeWhatsapp,
    chatJid: string,
  ): WAMessageKey {
    const payload = mensaje.payloadCrudo as
      | { key?: WAMessageKey }
      | null
      | undefined;
    if (payload?.key) return payload.key;
    return {
      id: mensaje.externoId,
      remoteJid: chatJid,
      fromMe: mensaje.direccion === 'SALIENTE',
    };
  }
}

function extensionDeMime(mime: string): string {
  if (!mime) return 'bin';
  const subtipo = mime.split('/')[1] ?? 'bin';
  return subtipo.split(';')[0].split('+')[0];
}

function construirContenidoMedia(
  tipo: 'IMAGEN' | 'VIDEO' | 'AUDIO' | 'DOCUMENTO',
  buffer: Buffer,
  mimetype: string,
  nombreArchivo: string | undefined,
  caption: string | undefined,
): AnyMessageContent {
  switch (tipo) {
    case 'IMAGEN':
      return { image: buffer, caption: caption ?? undefined };
    case 'VIDEO':
      return { video: buffer, caption: caption ?? undefined };
    case 'AUDIO':
      return {
        audio: buffer,
        ptt: mimetype.includes('opus') || mimetype.includes('ogg'),
      };
    case 'DOCUMENTO':
      return {
        document: buffer,
        mimetype,
        fileName: nombreArchivo,
        caption: caption ?? undefined,
      };
  }
}
