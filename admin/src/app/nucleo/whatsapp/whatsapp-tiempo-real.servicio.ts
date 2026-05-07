import { Injectable, computed, inject, signal } from "@angular/core";

import { Socket, io } from "socket.io-client";

import { environment } from "../../../environments/environment";
import { AutenticacionServicio } from "../autenticacion/autenticacion.servicio";
import {
  ChatWhatsapp,
  MensajeEstadoEvento,
  MensajeReaccionEvento,
  MensajeWhatsapp,
  SesionWhatsapp,
} from "../modelos/whatsapp.modelo";

/**
 * Singleton que envuelve el socket.io-client al namespace `/whatsapp` y
 * mantiene en memoria signals con el estado de la sesion, los chats abiertos
 * y los mensajes recibidos en tiempo real.
 *
 * El componente principal llama `inicializar()` al entrar a `/whatsapp` y
 * `desconectar()` al salir.
 */
@Injectable({ providedIn: "root" })
export class WhatsappTiempoRealServicio {
  private readonly auth = inject(AutenticacionServicio);
  private socket: Socket | null = null;

  private readonly _estadoSesion = signal<SesionWhatsapp | null>(null);
  readonly estadoSesion = this._estadoSesion.asReadonly();

  private readonly _conectadoWs = signal(false);
  readonly conectadoWs = this._conectadoWs.asReadonly();

  /**
   * Map de chats por id, ordenados por `ultimoMensajeEn` desc al exponerlos.
   */
  private readonly _chatsPorId = signal<Map<string, ChatWhatsapp>>(new Map());

  readonly chats = computed<ChatWhatsapp[]>(() => {
    const arr = Array.from(this._chatsPorId().values());
    return arr.sort((a, b) => {
      const ta = a.ultimoMensajeEn ? Date.parse(a.ultimoMensajeEn) : 0;
      const tb = b.ultimoMensajeEn ? Date.parse(b.ultimoMensajeEn) : 0;
      return tb - ta;
    });
  });

  /**
   * Map de mensajes por chatId. Cada entrada es un arreglo ordenado ASC por creadoEn.
   */
  private readonly _mensajesPorChat = signal<Map<string, MensajeWhatsapp[]>>(
    new Map(),
  );
  readonly mensajesPorChat = this._mensajesPorChat.asReadonly();

  inicializar(): void {
    if (this.socket) return;

    const token = this.auth.tokenAcceso;
    if (!token) return;

    const url = this.derivarUrl();
    this.socket = io(`${url}/whatsapp`, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      reconnectionAttempts: Infinity,
    });

    this.socket.on("connect", () => this._conectadoWs.set(true));
    this.socket.on("disconnect", () => this._conectadoWs.set(false));

    this.socket.on("sesion:estado", (sesion: SesionWhatsapp) => {
      this._estadoSesion.set(sesion);
    });

    this.socket.on("chat:upsert", (chat: ChatWhatsapp) => {
      this._chatsPorId.update((mapa) => {
        const nuevo = new Map(mapa);
        nuevo.set(chat.id, chat);
        return nuevo;
      });
    });

    this.socket.on("mensaje:nuevo", (mensaje: MensajeWhatsapp) => {
      this._mensajesPorChat.update((mapa) => {
        const nuevo = new Map(mapa);
        const lista = nuevo.get(mensaje.chatId) ?? [];
        // Idempotencia: si ya esta por id, lo reemplaza; si no, agrega.
        const idx = lista.findIndex((m) => m.id === mensaje.id);
        if (idx >= 0) {
          const copia = [...lista];
          copia[idx] = mensaje;
          nuevo.set(mensaje.chatId, copia);
        } else {
          nuevo.set(mensaje.chatId, [...lista, mensaje]);
        }
        return nuevo;
      });
    });

    this.socket.on("mensaje:estado", (evento: MensajeEstadoEvento) => {
      this._mensajesPorChat.update((mapa) => {
        const lista = mapa.get(evento.chatId);
        if (!lista) return mapa;
        const idx = lista.findIndex((m) => m.id === evento.mensajeId);
        if (idx < 0) return mapa;
        const copia = [...lista];
        copia[idx] = {
          ...copia[idx],
          estado: evento.estado,
          entregadoEn: evento.entregadoEn,
          leidoEn: evento.leidoEn,
        };
        const nuevoMapa = new Map(mapa);
        nuevoMapa.set(evento.chatId, copia);
        return nuevoMapa;
      });
    });

    this.socket.on("mensaje:reaccion", (_evento: MensajeReaccionEvento) => {
      // En Fase 3 no proyectamos reacciones en la UI. Llega el evento; lo dejamos
      // listo para Fase 4.
    });
  }

  desconectar(): void {
    if (!this.socket) return;
    this.socket.disconnect();
    this.socket = null;
    this._conectadoWs.set(false);
    this._chatsPorId.set(new Map());
    this._mensajesPorChat.set(new Map());
  }

  cargarChats(chats: ChatWhatsapp[]): void {
    const mapa = new Map<string, ChatWhatsapp>();
    for (const chat of chats) {
      mapa.set(chat.id, chat);
    }
    this._chatsPorId.set(mapa);
  }

  cargarMensajesIniciales(chatId: string, mensajes: MensajeWhatsapp[]): void {
    // Los mensajes vienen del backend en orden DESC (mas reciente primero).
    // Los persistimos en orden ASC para renderizar de arriba hacia abajo.
    const ordenAsc = [...mensajes].reverse();
    this._mensajesPorChat.update((mapa) => {
      const nuevo = new Map(mapa);
      nuevo.set(chatId, ordenAsc);
      return nuevo;
    });
  }

  prependMensajes(chatId: string, mensajes: MensajeWhatsapp[]): void {
    const ordenAsc = [...mensajes].reverse();
    this._mensajesPorChat.update((mapa) => {
      const nuevo = new Map(mapa);
      const actuales = nuevo.get(chatId) ?? [];
      // Evitar duplicados por id.
      const existentes = new Set(actuales.map((m) => m.id));
      const filtrados = ordenAsc.filter((m) => !existentes.has(m.id));
      nuevo.set(chatId, [...filtrados, ...actuales]);
      return nuevo;
    });
  }

  private derivarUrl(): string {
    const url = environment.urlApi;
    if (url.startsWith("/")) {
      return window.location.origin;
    }
    try {
      const parsed = new URL(url);
      return `${parsed.protocol}//${parsed.host}`;
    } catch {
      return window.location.origin;
    }
  }
}
