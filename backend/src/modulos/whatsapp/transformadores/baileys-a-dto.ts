import type { Contact, WAMessage } from 'baileys';
import type {
  DireccionMensajeWhatsapp,
  EstadoMensajeWhatsapp,
  TipoChatWhatsapp,
  TipoMensajeWhatsapp,
} from '../../../generated/prisma/client.js';

export interface ChatNormalizado {
  jid: string;
  tipo: TipoChatWhatsapp;
  nombre: string | null;
  noLeidos: number | null;
  ultimoMensajeEn: Date | null;
}

export interface ContactoNormalizado {
  jid: string;
  numero: string | null;
  nombre: string | null;
}

export interface MensajeNormalizado {
  externoId: string;
  chatJid: string;
  remitenteJid: string | null;
  direccion: DireccionMensajeWhatsapp;
  tipo: TipoMensajeWhatsapp;
  texto: string | null;
  caption: string | null;
  mimeMedia: string | null;
  bytesMedia: number | null;
  duracionSeg: number | null;
  nombreArchivo: string | null;
  enviadoEn: Date | null;
  payloadCrudo: unknown;
}

/**
 * Determina si un jid es de grupo (`@g.us`).
 */
export function jidEsGrupo(jid: string): boolean {
  return jid.endsWith('@g.us');
}

export function tipoChatDeJid(jid: string): TipoChatWhatsapp {
  return jidEsGrupo(jid) ? 'GRUPO' : 'INDIVIDUAL';
}

export function extraerNumeroDeJid(jid: string): string | null {
  const partes = jid.split('@');
  if (partes.length !== 2) return null;
  const numero = partes[0].split(':')[0];
  return /^\d+$/.test(numero) ? numero : null;
}

/**
 * Mapea el `status` numerico de baileys a nuestro enum.
 *  1 = ERROR, 2 = PENDING, 3 = SERVER_ACK, 4 = DELIVERY_ACK, 5 = READ, 6 = PLAYED.
 */
export function mapearEstadoBaileys(
  status: number | null | undefined,
): EstadoMensajeWhatsapp | null {
  if (status === undefined || status === null) return null;
  switch (status) {
    case 1:
      return 'FALLIDO';
    case 2:
      return 'PENDIENTE';
    case 3:
      return 'ENVIADO';
    case 4:
      return 'ENTREGADO';
    case 5:
      return 'LEIDO';
    case 6:
      return 'LEIDO';
    default:
      return null;
  }
}

/**
 * Toma un `WAMessage` crudo y devuelve el dto normalizado para persistir.
 * Si el mensaje no tiene contenido procesable (p.ej. solo stub) devuelve null.
 */
export function normalizarMensaje(msg: WAMessage): MensajeNormalizado | null {
  if (!msg.key?.id || !msg.key?.remoteJid) return null;

  const fromMe = Boolean(msg.key.fromMe);
  const direccion: DireccionMensajeWhatsapp = fromMe ? 'SALIENTE' : 'ENTRANTE';
  const remitenteJid = fromMe
    ? null
    : (msg.key.participant ?? msg.key.remoteJid);

  const enviadoEn = enviadoEnDeMensaje(msg);
  const { tipo, texto, caption, mimeMedia, bytesMedia, duracionSeg, nombreArchivo } =
    extraerContenido(msg);

  // Si es solo un stub (entrada/salida de grupo, etc.) y no hay nada significativo, ignorar.
  if (tipo === 'SISTEMA' && !texto) {
    return null;
  }

  return {
    externoId: msg.key.id,
    chatJid: msg.key.remoteJid,
    remitenteJid,
    direccion,
    tipo,
    texto,
    caption,
    mimeMedia,
    bytesMedia,
    duracionSeg,
    nombreArchivo,
    enviadoEn,
    payloadCrudo: msg,
  };
}

function enviadoEnDeMensaje(msg: WAMessage): Date | null {
  const ts = msg.messageTimestamp;
  if (!ts) return null;
  const numero =
    typeof ts === 'number'
      ? ts
      : typeof ts === 'object' && 'toNumber' in ts
        ? (ts as { toNumber: () => number }).toNumber()
        : Number(ts);
  if (!Number.isFinite(numero) || numero <= 0) return null;
  return new Date(numero * 1000);
}

interface Contenido {
  tipo: TipoMensajeWhatsapp;
  texto: string | null;
  caption: string | null;
  mimeMedia: string | null;
  bytesMedia: number | null;
  duracionSeg: number | null;
  nombreArchivo: string | null;
}

function extraerContenido(msg: WAMessage): Contenido {
  const m = msg.message ?? null;
  if (!m) {
    return contenidoVacio('SISTEMA');
  }

  if (m.conversation) {
    return { ...contenidoVacio('TEXTO'), texto: m.conversation };
  }

  if (m.extendedTextMessage?.text) {
    return {
      ...contenidoVacio('TEXTO'),
      texto: m.extendedTextMessage.text,
    };
  }

  if (m.imageMessage) {
    return {
      ...contenidoVacio('IMAGEN'),
      caption: m.imageMessage.caption ?? null,
      mimeMedia: m.imageMessage.mimetype ?? null,
      bytesMedia: numeroSeguro(m.imageMessage.fileLength),
    };
  }

  if (m.videoMessage) {
    return {
      ...contenidoVacio('VIDEO'),
      caption: m.videoMessage.caption ?? null,
      mimeMedia: m.videoMessage.mimetype ?? null,
      bytesMedia: numeroSeguro(m.videoMessage.fileLength),
      duracionSeg: m.videoMessage.seconds ?? null,
    };
  }

  if (m.audioMessage) {
    return {
      ...contenidoVacio('AUDIO'),
      mimeMedia: m.audioMessage.mimetype ?? null,
      bytesMedia: numeroSeguro(m.audioMessage.fileLength),
      duracionSeg: m.audioMessage.seconds ?? null,
    };
  }

  if (m.documentMessage) {
    return {
      ...contenidoVacio('DOCUMENTO'),
      caption: m.documentMessage.caption ?? null,
      mimeMedia: m.documentMessage.mimetype ?? null,
      bytesMedia: numeroSeguro(m.documentMessage.fileLength),
      nombreArchivo: m.documentMessage.fileName ?? null,
    };
  }

  if (m.documentWithCaptionMessage?.message?.documentMessage) {
    const doc = m.documentWithCaptionMessage.message.documentMessage;
    return {
      ...contenidoVacio('DOCUMENTO'),
      caption: doc.caption ?? null,
      mimeMedia: doc.mimetype ?? null,
      bytesMedia: numeroSeguro(doc.fileLength),
      nombreArchivo: doc.fileName ?? null,
    };
  }

  if (m.stickerMessage) {
    return {
      ...contenidoVacio('STICKER'),
      mimeMedia: m.stickerMessage.mimetype ?? null,
    };
  }

  if (m.locationMessage || m.liveLocationMessage) {
    return contenidoVacio('UBICACION');
  }

  if (m.contactMessage || m.contactsArrayMessage) {
    return contenidoVacio('CONTACTO');
  }

  // Cualquier otro mensaje no clasificado se marca como SISTEMA.
  return contenidoVacio('SISTEMA');
}

function contenidoVacio(tipo: TipoMensajeWhatsapp): Contenido {
  return {
    tipo,
    texto: null,
    caption: null,
    mimeMedia: null,
    bytesMedia: null,
    duracionSeg: null,
    nombreArchivo: null,
  };
}

function numeroSeguro(valor: unknown): number | null {
  if (valor === null || valor === undefined) return null;
  if (typeof valor === 'number') return Number.isFinite(valor) ? valor : null;
  if (typeof valor === 'object' && 'toNumber' in (valor as object)) {
    try {
      const n = (valor as { toNumber: () => number }).toNumber();
      return Number.isFinite(n) ? n : null;
    } catch {
      return null;
    }
  }
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
}

/**
 * Normaliza un objeto Chat de baileys a la forma que usamos en DB.
 */
export function normalizarChat(chat: {
  id: string;
  name?: string | null;
  unreadCount?: number | null;
  conversationTimestamp?: number | null | { toNumber: () => number };
}): ChatNormalizado {
  return {
    jid: chat.id,
    tipo: tipoChatDeJid(chat.id),
    nombre: chat.name ?? null,
    noLeidos: typeof chat.unreadCount === 'number' ? chat.unreadCount : null,
    ultimoMensajeEn: convertirTimestamp(chat.conversationTimestamp),
  };
}

export function normalizarContacto(contacto: Contact): ContactoNormalizado {
  return {
    jid: contacto.id,
    numero: contacto.phoneNumber
      ? extraerNumeroDeJid(contacto.phoneNumber)
      : extraerNumeroDeJid(contacto.id),
    nombre:
      contacto.name ??
      contacto.notify ??
      contacto.verifiedName ??
      null,
  };
}

function convertirTimestamp(
  ts: number | null | undefined | { toNumber: () => number },
): Date | null {
  if (ts === null || ts === undefined) return null;
  const num =
    typeof ts === 'number'
      ? ts
      : typeof ts === 'object' && 'toNumber' in ts
        ? (ts as { toNumber: () => number }).toNumber()
        : Number(ts);
  if (!Number.isFinite(num) || num <= 0) return null;
  return new Date(num * 1000);
}
