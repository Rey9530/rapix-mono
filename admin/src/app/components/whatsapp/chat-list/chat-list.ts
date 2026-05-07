import { CommonModule } from "@angular/common";
import { Component, computed, input, output, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { ChatWhatsapp } from "../../../nucleo/modelos/whatsapp.modelo";

@Component({
  selector: "app-chat-list",
  imports: [CommonModule, FormsModule],
  templateUrl: "./chat-list.html",
  styleUrl: "./chat-list.scss",
})
export class ChatList {
  readonly chats = input<ChatWhatsapp[]>([]);
  readonly chatActivoId = input<string | null>(null);
  readonly seleccionar = output<ChatWhatsapp>();

  readonly busqueda = signal("");

  readonly chatsFiltrados = computed<ChatWhatsapp[]>(() => {
    const q = this.busqueda().trim().toLowerCase();
    const lista = this.chats();
    if (!q) return lista;
    return lista.filter((c) => {
      return (
        (c.nombre ?? "").toLowerCase().includes(q) ||
        (c.numero ?? "").includes(q) ||
        c.jid.toLowerCase().includes(q)
      );
    });
  });

  abrirChat(chat: ChatWhatsapp): void {
    this.seleccionar.emit(chat);
  }

  formatearHora(iso: string | null): string {
    if (!iso) return "";
    const fecha = new Date(iso);
    const ahora = new Date();
    const mismoDia =
      fecha.getFullYear() === ahora.getFullYear() &&
      fecha.getMonth() === ahora.getMonth() &&
      fecha.getDate() === ahora.getDate();
    if (mismoDia) {
      return fecha.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return fecha.toLocaleDateString();
  }

  iniciales(chat: ChatWhatsapp): string {
    const fuente = chat.nombre ?? chat.numero ?? chat.jid;
    return fuente.slice(0, 2).toUpperCase();
  }
}
