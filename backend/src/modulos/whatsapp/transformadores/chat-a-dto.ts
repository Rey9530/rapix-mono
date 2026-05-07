import type { ChatWhatsapp } from '../../../generated/prisma/client.js';
import { ChatWhatsappDto } from '../dto/chat-whatsapp.dto.js';
import { extraerNumeroDeJid } from './baileys-a-dto.js';

export function chatADto(chat: ChatWhatsapp): ChatWhatsappDto {
  return {
    id: chat.id,
    jid: chat.jid,
    tipo: chat.tipo,
    nombre: chat.nombre,
    numero: extraerNumeroDeJid(chat.jid),
    urlAvatar: chat.urlAvatar,
    ultimoMensajeEn: chat.ultimoMensajeEn
      ? chat.ultimoMensajeEn.toISOString()
      : null,
    noLeidos: chat.noLeidos,
    archivado: chat.archivado,
  };
}
