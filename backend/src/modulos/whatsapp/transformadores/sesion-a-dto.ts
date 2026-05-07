import type { SesionWhatsapp } from '../../../generated/prisma/client.js';
import { SesionWhatsappDto } from '../dto/sesion-whatsapp.dto.js';

export function sesionADto(sesion: SesionWhatsapp): SesionWhatsappDto {
  return {
    estado: sesion.estado,
    jidPropio: sesion.jidPropio,
    numeroPropio: sesion.numeroPropio,
    nombrePropio: sesion.nombrePropio,
    qrActual: sesion.qrActual,
    qrExpiraEn: sesion.qrExpiraEn ? sesion.qrExpiraEn.toISOString() : null,
    conectadoEn: sesion.conectadoEn ? sesion.conectadoEn.toISOString() : null,
    desconectadoEn: sesion.desconectadoEn
      ? sesion.desconectadoEn.toISOString()
      : null,
    ultimoError: sesion.ultimoError,
  };
}
