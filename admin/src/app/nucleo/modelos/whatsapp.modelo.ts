export type EstadoSesionWhatsapp =
  | "DESCONECTADA"
  | "ESPERANDO_QR"
  | "CONECTADA"
  | "EXPIRADA"
  | "BANEADA";

export type TipoChatWhatsapp = "INDIVIDUAL" | "GRUPO";

export type DireccionMensajeWhatsapp = "ENTRANTE" | "SALIENTE";

export type TipoMensajeWhatsapp =
  | "TEXTO"
  | "IMAGEN"
  | "VIDEO"
  | "AUDIO"
  | "DOCUMENTO"
  | "STICKER"
  | "UBICACION"
  | "CONTACTO"
  | "SISTEMA";

export type EstadoMensajeWhatsapp =
  | "PENDIENTE"
  | "ENVIADO"
  | "ENTREGADO"
  | "LEIDO"
  | "FALLIDO";

export interface SesionWhatsapp {
  estado: EstadoSesionWhatsapp;
  jidPropio: string | null;
  numeroPropio: string | null;
  nombrePropio: string | null;
  qrActual: string | null;
  qrExpiraEn: string | null;
  conectadoEn: string | null;
  desconectadoEn: string | null;
  ultimoError: string | null;
}

export interface ChatWhatsapp {
  id: string;
  jid: string;
  tipo: TipoChatWhatsapp;
  nombre: string | null;
  numero: string | null;
  urlAvatar: string | null;
  ultimoMensajeEn: string | null;
  noLeidos: number;
  archivado: boolean;
}

export interface MensajeWhatsapp {
  id: string;
  externoId: string;
  chatId: string;
  remitenteId: string | null;
  direccion: DireccionMensajeWhatsapp;
  tipo: TipoMensajeWhatsapp;
  estado: EstadoMensajeWhatsapp;
  texto: string | null;
  caption: string | null;
  urlMedia: string | null;
  mimeMedia: string | null;
  bytesMedia: number | null;
  duracionSeg: number | null;
  nombreArchivo: string | null;
  enviadoEn: string | null;
  entregadoEn: string | null;
  leidoEn: string | null;
  creadoEn: string;
}

export interface ListaChats {
  datos: ChatWhatsapp[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

export interface ListaMensajes {
  datos: MensajeWhatsapp[];
  cursor: string | null;
}

export interface MensajeEstadoEvento {
  mensajeId: string;
  chatId: string;
  estado: EstadoMensajeWhatsapp;
  entregadoEn: string | null;
  leidoEn: string | null;
}

export interface MensajeReaccionEvento {
  mensajeId: string;
  chatId: string;
  jidAutor: string;
  emoji: string | null;
}
