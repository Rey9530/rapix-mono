import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import {
  ChatWhatsapp,
  ListaChats,
  ListaMensajes,
  SesionWhatsapp,
} from "../modelos/whatsapp.modelo";

interface FiltrosChats {
  busqueda?: string;
  tipo?: "INDIVIDUAL" | "GRUPO";
  pagina?: number;
  limite?: number;
}

@Injectable({ providedIn: "root" })
export class WhatsappServicio {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.urlApi}/whatsapp`;

  obtenerSesion(): Observable<SesionWhatsapp> {
    return this.http.get<SesionWhatsapp>(`${this.base}/sesion`);
  }

  vincular(): Observable<SesionWhatsapp> {
    return this.http.post<SesionWhatsapp>(`${this.base}/sesion/vincular`, {});
  }

  cerrarSesion(): Observable<SesionWhatsapp> {
    return this.http.delete<SesionWhatsapp>(`${this.base}/sesion`);
  }

  listarChats(filtros: FiltrosChats = {}): Observable<ListaChats> {
    let params = new HttpParams();
    Object.entries(filtros).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        params = params.set(k, String(v));
      }
    });
    return this.http.get<ListaChats>(`${this.base}/chats`, { params });
  }

  obtenerChat(chatId: string): Observable<ChatWhatsapp> {
    return this.http.get<ChatWhatsapp>(`${this.base}/chats/${chatId}`);
  }

  listarMensajes(
    chatId: string,
    antesDe?: string | null,
    limite = 50,
  ): Observable<ListaMensajes> {
    let params = new HttpParams().set("limite", String(limite));
    if (antesDe) params = params.set("antesDe", antesDe);
    return this.http.get<ListaMensajes>(
      `${this.base}/chats/${chatId}/mensajes`,
      { params },
    );
  }

  enviarTexto(
    chatId: string,
    texto: string,
    respondeAId?: string,
  ): Observable<import("../modelos/whatsapp.modelo").MensajeWhatsapp> {
    return this.http.post<
      import("../modelos/whatsapp.modelo").MensajeWhatsapp
    >(`${this.base}/chats/${chatId}/mensajes/texto`, {
      texto,
      ...(respondeAId ? { respondeAId } : {}),
    });
  }

  enviarMedia(
    chatId: string,
    archivo: File,
    tipo: "IMAGEN" | "VIDEO" | "AUDIO" | "DOCUMENTO",
    caption?: string,
    respondeAId?: string,
  ): Observable<import("../modelos/whatsapp.modelo").MensajeWhatsapp> {
    const form = new FormData();
    form.append("archivo", archivo);
    form.append("tipo", tipo);
    if (caption) form.append("caption", caption);
    if (respondeAId) form.append("respondeAId", respondeAId);
    return this.http.post<
      import("../modelos/whatsapp.modelo").MensajeWhatsapp
    >(`${this.base}/chats/${chatId}/mensajes/media`, form);
  }

  reaccionar(
    chatId: string,
    mensajeId: string,
    emoji: string | null,
  ): Observable<void> {
    return this.http.post<void>(
      `${this.base}/chats/${chatId}/mensajes/${mensajeId}/reaccion`,
      { emoji },
    );
  }

  marcarLeido(chatId: string): Observable<{ noLeidos: number }> {
    return this.http.post<{ noLeidos: number }>(
      `${this.base}/chats/${chatId}/leido`,
      {},
    );
  }
}
