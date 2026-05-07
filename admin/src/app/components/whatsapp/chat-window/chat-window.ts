import { CommonModule } from "@angular/common";
import {
  AfterViewChecked,
  Component,
  ElementRef,
  ViewChild,
  computed,
  effect,
  inject,
  input,
} from "@angular/core";

import { ToastrService } from "ngx-toastr";

import { MessageBubble } from "../message-bubble/message-bubble";
import { MessageComposer } from "../message-composer/message-composer";
import { WhatsappServicio } from "../../../nucleo/datos/whatsapp.servicio";
import {
  ChatWhatsapp,
  MensajeWhatsapp,
} from "../../../nucleo/modelos/whatsapp.modelo";
import { WhatsappTiempoRealServicio } from "../../../nucleo/whatsapp/whatsapp-tiempo-real.servicio";

@Component({
  selector: "app-chat-window",
  imports: [CommonModule, MessageBubble, MessageComposer],
  templateUrl: "./chat-window.html",
  styleUrl: "./chat-window.scss",
})
export class ChatWindow implements AfterViewChecked {
  readonly chat = input<ChatWhatsapp | null>(null);

  private readonly servicio = inject(WhatsappServicio);
  private readonly tiempoReal = inject(WhatsappTiempoRealServicio);
  private readonly toast = inject(ToastrService);

  @ViewChild("scroll") scroll?: ElementRef<HTMLDivElement>;

  cargandoHistorial = false;
  private ultimoChatCargadoId: string | null = null;
  private mensajesAnterior = 0;

  readonly mensajes = computed<MensajeWhatsapp[]>(() => {
    const c = this.chat();
    if (!c) return [];
    return this.tiempoReal.mensajesPorChat().get(c.id) ?? [];
  });

  constructor() {
    effect(() => {
      const c = this.chat();
      if (c && c.id !== this.ultimoChatCargadoId) {
        this.ultimoChatCargadoId = c.id;
        this.cargarHistorial(c.id);
        // Marcar el chat como leido al abrirlo (best-effort).
        if (c.noLeidos > 0) {
          this.servicio.marcarLeido(c.id).subscribe({ error: () => {} });
        }
      }
    });
  }

  ngAfterViewChecked(): void {
    const total = this.mensajes().length;
    if (total !== this.mensajesAnterior) {
      this.mensajesAnterior = total;
      this.scrollAlFinal();
    }
  }

  cargarMas(): void {
    const c = this.chat();
    if (!c || this.cargandoHistorial) return;
    const lista = this.tiempoReal.mensajesPorChat().get(c.id) ?? [];
    const cursor = lista.length > 0 ? lista[0].creadoEn : null;
    if (!cursor) {
      this.cargarHistorial(c.id);
      return;
    }
    this.cargandoHistorial = true;
    this.servicio.listarMensajes(c.id, cursor, 50).subscribe({
      next: (resp) => {
        this.tiempoReal.prependMensajes(c.id, resp.datos);
        this.cargandoHistorial = false;
      },
      error: () => {
        this.cargandoHistorial = false;
        this.toast.error("No se pudo cargar mas mensajes");
      },
    });
  }

  private cargarHistorial(chatId: string): void {
    this.cargandoHistorial = true;
    this.servicio.listarMensajes(chatId, null, 50).subscribe({
      next: (resp) => {
        this.tiempoReal.cargarMensajesIniciales(chatId, resp.datos);
        this.cargandoHistorial = false;
        setTimeout(() => this.scrollAlFinal(), 0);
      },
      error: () => {
        this.cargandoHistorial = false;
        this.toast.error("No se pudo cargar el historial");
      },
    });
  }

  private scrollAlFinal(): void {
    const el = this.scroll?.nativeElement;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }
}
