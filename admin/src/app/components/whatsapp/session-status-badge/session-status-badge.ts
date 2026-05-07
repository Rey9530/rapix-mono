import { CommonModule } from "@angular/common";
import { Component, computed, input, output } from "@angular/core";

import { SesionWhatsapp } from "../../../nucleo/modelos/whatsapp.modelo";

@Component({
  selector: "app-session-status-badge",
  imports: [CommonModule],
  templateUrl: "./session-status-badge.html",
})
export class SessionStatusBadge {
  readonly sesion = input<SesionWhatsapp | null>(null);
  readonly conectadoWs = input<boolean>(false);
  readonly desvincular = output<void>();

  readonly etiqueta = computed<string>(() => {
    const s = this.sesion();
    if (!s) return "Cargando...";
    switch (s.estado) {
      case "CONECTADA":
        return s.numeroPropio ? `Conectado · ${s.numeroPropio}` : "Conectado";
      case "ESPERANDO_QR":
        return "Esperando QR";
      case "DESCONECTADA":
        return "Desconectado";
      case "EXPIRADA":
        return "Sesion expirada";
      case "BANEADA":
        return "Numero baneado";
      default:
        return s.estado;
    }
  });

  readonly clase = computed<string>(() => {
    const s = this.sesion();
    if (!s) return "bg-light text-dark";
    switch (s.estado) {
      case "CONECTADA":
        return "bg-success";
      case "ESPERANDO_QR":
        return "bg-warning text-dark";
      case "BANEADA":
        return "bg-danger";
      case "EXPIRADA":
        return "bg-secondary";
      default:
        return "bg-light text-dark";
    }
  });

  emitirDesvincular(): void {
    this.desvincular.emit();
  }
}
