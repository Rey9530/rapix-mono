import type { MensajeWhatsapp } from '../../../generated/prisma/client.js';
import { MensajeWhatsappDto } from '../dto/mensaje-whatsapp.dto.js';

export function mensajeADto(mensaje: MensajeWhatsapp): MensajeWhatsappDto {
  return {
    id: mensaje.id,
    externoId: mensaje.externoId,
    chatId: mensaje.chatId,
    remitenteId: mensaje.remitenteId,
    direccion: mensaje.direccion,
    tipo: mensaje.tipo,
    estado: mensaje.estado,
    texto: mensaje.texto,
    caption: mensaje.caption,
    urlMedia: mensaje.urlMedia,
    mimeMedia: mensaje.mimeMedia,
    bytesMedia: mensaje.bytesMedia,
    duracionSeg: mensaje.duracionSeg,
    nombreArchivo: mensaje.nombreArchivo,
    enviadoEn: mensaje.enviadoEn ? mensaje.enviadoEn.toISOString() : null,
    entregadoEn: mensaje.entregadoEn ? mensaje.entregadoEn.toISOString() : null,
    leidoEn: mensaje.leidoEn ? mensaje.leidoEn.toISOString() : null,
    creadoEn: mensaje.creadoEn.toISOString(),
  };
}
