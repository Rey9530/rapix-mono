import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  ViewChild,
  computed,
  inject,
  input,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import { ToastrService } from "ngx-toastr";

import { WhatsappServicio } from "../../../nucleo/datos/whatsapp.servicio";
import { ChatWhatsapp } from "../../../nucleo/modelos/whatsapp.modelo";

interface AdjuntoSeleccionado {
  archivo: File;
  tipo: "IMAGEN" | "VIDEO" | "AUDIO" | "DOCUMENTO";
}

@Component({
  selector: "app-message-composer",
  imports: [CommonModule, FormsModule],
  templateUrl: "./message-composer.html",
  styleUrl: "./message-composer.scss",
})
export class MessageComposer {
  private readonly servicio = inject(WhatsappServicio);
  private readonly toast = inject(ToastrService);

  readonly chat = input.required<ChatWhatsapp>();
  readonly deshabilitado = input<boolean>(false);

  @ViewChild("inputArchivo")
  inputArchivo?: ElementRef<HTMLInputElement>;

  readonly texto = signal("");
  readonly adjunto = signal<AdjuntoSeleccionado | null>(null);
  readonly enviando = signal(false);

  readonly puedeEnviar = computed(() => {
    if (this.enviando() || this.deshabilitado()) return false;
    return this.texto().trim().length > 0 || this.adjunto() !== null;
  });

  abrirSelectorArchivo(): void {
    this.inputArchivo?.nativeElement.click();
  }

  alSeleccionarArchivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    input.value = "";
    if (!archivo) return;
    if (archivo.size > 16 * 1024 * 1024) {
      this.toast.error("El archivo excede el limite de 16 MB");
      return;
    }
    const tipo = inferirTipo(archivo.type);
    this.adjunto.set({ archivo, tipo });
  }

  quitarAdjunto(): void {
    this.adjunto.set(null);
  }

  manejarTeclaTextarea(event: KeyboardEvent): void {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      this.enviar();
    }
  }

  enviar(): void {
    if (!this.puedeEnviar()) return;
    const chat = this.chat();
    const adjunto = this.adjunto();
    const texto = this.texto().trim();

    this.enviando.set(true);

    if (adjunto) {
      this.servicio
        .enviarMedia(chat.id, adjunto.archivo, adjunto.tipo, texto || undefined)
        .subscribe({
          next: () => {
            this.texto.set("");
            this.adjunto.set(null);
            this.enviando.set(false);
          },
          error: (err) => {
            this.enviando.set(false);
            this.toast.error(
              err?.error?.message ?? "No se pudo enviar el archivo",
            );
          },
        });
    } else {
      this.servicio.enviarTexto(chat.id, texto).subscribe({
        next: () => {
          this.texto.set("");
          this.enviando.set(false);
        },
        error: (err) => {
          this.enviando.set(false);
          this.toast.error(err?.error?.message ?? "No se pudo enviar el mensaje");
        },
      });
    }
  }

  formatearTamano(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}

function inferirTipo(
  mimetype: string,
): "IMAGEN" | "VIDEO" | "AUDIO" | "DOCUMENTO" {
  if (mimetype.startsWith("image/")) return "IMAGEN";
  if (mimetype.startsWith("video/")) return "VIDEO";
  if (mimetype.startsWith("audio/")) return "AUDIO";
  return "DOCUMENTO";
}
