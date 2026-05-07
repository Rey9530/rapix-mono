import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  computed,
  effect,
  inject,
  input,
} from "@angular/core";

import { ToastrService } from "ngx-toastr";
import * as QRCode from "qrcode";

import { WhatsappServicio } from "../../../nucleo/datos/whatsapp.servicio";
import { SesionWhatsapp } from "../../../nucleo/modelos/whatsapp.modelo";

@Component({
  selector: "app-qr-login-panel",
  imports: [CommonModule],
  templateUrl: "./qr-login-panel.html",
  styleUrl: "./qr-login-panel.scss",
})
export class QrLoginPanel implements AfterViewInit {
  private readonly servicio = inject(WhatsappServicio);
  private readonly toast = inject(ToastrService);

  readonly sesion = input<SesionWhatsapp | null>(null);

  @ViewChild("canvasQr", { static: false })
  canvasQr?: ElementRef<HTMLCanvasElement>;

  vinculando = false;

  readonly mensaje = computed<string>(() => {
    const s = this.sesion();
    if (!s) return "Cargando estado...";
    switch (s.estado) {
      case "DESCONECTADA":
        return "Sin sesion vinculada. Pulsa \"Vincular\" para generar un QR.";
      case "ESPERANDO_QR":
        return "Escanea el codigo QR con WhatsApp en tu telefono (Ajustes → Dispositivos vinculados → Vincular un dispositivo).";
      case "EXPIRADA":
        return "La sesion expiro. Vuelve a vincular un telefono.";
      case "BANEADA":
        return "El numero fue baneado por WhatsApp. Contacta al equipo de operaciones.";
      case "CONECTADA":
        return "Conectado.";
      default:
        return "";
    }
  });

  constructor() {
    effect(() => {
      const s = this.sesion();
      if (s?.qrActual) {
        this.renderizarQr(s.qrActual);
      }
    });
  }

  ngAfterViewInit(): void {
    const s = this.sesion();
    if (s?.qrActual) {
      this.renderizarQr(s.qrActual);
    }
  }

  vincular(): void {
    if (this.vinculando) return;
    this.vinculando = true;
    this.servicio.vincular().subscribe({
      next: () => {
        this.vinculando = false;
        this.toast.info("Generando codigo QR...");
      },
      error: (err) => {
        this.vinculando = false;
        this.toast.error(err?.error?.message ?? "No se pudo iniciar la vinculacion");
      },
    });
  }

  private renderizarQr(texto: string): void {
    const canvas = this.canvasQr?.nativeElement;
    if (!canvas) return;
    QRCode.toCanvas(canvas, texto, { width: 280, margin: 2 }, (error) => {
      if (error) {
        this.toast.error("No se pudo dibujar el QR");
      }
    });
  }
}
