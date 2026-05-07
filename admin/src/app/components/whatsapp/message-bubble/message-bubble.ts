import { CommonModule } from "@angular/common";
import { Component, computed, inject, input, signal } from "@angular/core";

import { ToastrService } from "ngx-toastr";

import { WhatsappServicio } from "../../../nucleo/datos/whatsapp.servicio";
import { MensajeWhatsapp } from "../../../nucleo/modelos/whatsapp.modelo";

const EMOJIS_RAPIDOS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

@Component({
  selector: "app-message-bubble",
  imports: [CommonModule],
  templateUrl: "./message-bubble.html",
  styleUrl: "./message-bubble.scss",
})
export class MessageBubble {
  private readonly servicio = inject(WhatsappServicio);
  private readonly toast = inject(ToastrService);

  readonly mensaje = input.required<MensajeWhatsapp>();
  readonly mostrarRemitente = input<boolean>(false);

  readonly mostrarPicker = signal(false);
  readonly emojis = EMOJIS_RAPIDOS;

  readonly esSaliente = computed(() => this.mensaje().direccion === "SALIENTE");

  readonly hora = computed(() => {
    const m = this.mensaje();
    const iso = m.enviadoEn ?? m.creadoEn;
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  });

  readonly etiquetaTipo = computed(() => {
    const t = this.mensaje().tipo;
    switch (t) {
      case "IMAGEN":
        return "📷 Imagen";
      case "VIDEO":
        return "🎬 Video";
      case "AUDIO":
        return "🎤 Audio";
      case "DOCUMENTO":
        return "📎 Documento";
      case "STICKER":
        return "🌟 Sticker";
      case "UBICACION":
        return "📍 Ubicacion";
      case "CONTACTO":
        return "👤 Contacto";
      case "SISTEMA":
        return "ℹ Mensaje del sistema";
      default:
        return null;
    }
  });

  readonly textoCuerpo = computed(() => {
    const m = this.mensaje();
    if (m.tipo === "TEXTO") return m.texto;
    return m.caption;
  });

  readonly indicadorEstado = computed(() => {
    if (!this.esSaliente()) return null;
    switch (this.mensaje().estado) {
      case "PENDIENTE":
        return "🕓";
      case "ENVIADO":
        return "✓";
      case "ENTREGADO":
        return "✓✓";
      case "LEIDO":
        return "✓✓";
      case "FALLIDO":
        return "⚠";
      default:
        return null;
    }
  });

  readonly leido = computed(() => this.mensaje().estado === "LEIDO");

  togglePicker(): void {
    this.mostrarPicker.update((v) => !v);
  }

  cerrarPicker(): void {
    this.mostrarPicker.set(false);
  }

  reaccionar(emoji: string): void {
    const m = this.mensaje();
    this.cerrarPicker();
    this.servicio.reaccionar(m.chatId, m.id, emoji).subscribe({
      next: () => this.toast.success("Reaccion enviada"),
      error: (err) =>
        this.toast.error(err?.error?.message ?? "No se pudo reaccionar"),
    });
  }

  quitarReaccion(): void {
    const m = this.mensaje();
    this.cerrarPicker();
    this.servicio.reaccionar(m.chatId, m.id, null).subscribe({
      error: (err) =>
        this.toast.error(err?.error?.message ?? "No se pudo quitar reaccion"),
    });
  }
}
