import { CommonModule } from "@angular/common";
import {
  Component,
  OnDestroy,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";

import { ChatList } from "./chat-list/chat-list";
import { ChatWindow } from "./chat-window/chat-window";
import { ConfirmarLogoutModal } from "./confirmar-logout.modal";
import { QrLoginPanel } from "./qr-login-panel/qr-login-panel";
import { SessionStatusBadge } from "./session-status-badge/session-status-badge";
import { WhatsappServicio } from "../../nucleo/datos/whatsapp.servicio";
import { ChatWhatsapp } from "../../nucleo/modelos/whatsapp.modelo";
import { WhatsappTiempoRealServicio } from "../../nucleo/whatsapp/whatsapp-tiempo-real.servicio";

@Component({
  selector: "app-whatsapp-pagina",
  imports: [
    CommonModule,
    QrLoginPanel,
    SessionStatusBadge,
    ChatList,
    ChatWindow,
  ],
  templateUrl: "./whatsapp-pagina.html",
  styleUrl: "./whatsapp-pagina.scss",
})
export class WhatsappPagina implements OnInit, OnDestroy {
  private readonly servicio = inject(WhatsappServicio);
  private readonly tiempoReal = inject(WhatsappTiempoRealServicio);
  private readonly modal = inject(NgbModal);
  private readonly toast = inject(ToastrService);

  readonly sesion = this.tiempoReal.estadoSesion;
  readonly conectadoWs = this.tiempoReal.conectadoWs;
  readonly chats = this.tiempoReal.chats;

  readonly chatActivoId = signal<string | null>(null);
  readonly chatActivo = computed<ChatWhatsapp | null>(() => {
    const id = this.chatActivoId();
    if (!id) return null;
    return this.chats().find((c) => c.id === id) ?? null;
  });

  readonly mostrarQrPanel = computed(() => {
    const s = this.sesion();
    return !s || s.estado !== "CONECTADA";
  });

  private chatsCargados = false;

  constructor() {
    // Cuando la sesion entra en CONECTADA, dispara la carga inicial de chats.
    effect(() => {
      const s = this.sesion();
      if (s?.estado === "CONECTADA" && !this.chatsCargados) {
        this.chatsCargados = true;
        this.cargarChats();
      } else if (s && s.estado !== "CONECTADA") {
        this.chatsCargados = false;
      }
    });
  }

  ngOnInit(): void {
    this.servicio.obtenerSesion().subscribe({
      error: () => {
        this.toast.error("No se pudo consultar el estado de WhatsApp");
      },
    });
    this.tiempoReal.inicializar();
  }

  ngOnDestroy(): void {
    this.tiempoReal.desconectar();
  }

  abrirConfirmarLogout(): void {
    const ref = this.modal.open(ConfirmarLogoutModal, { centered: true });
    ref.closed.subscribe((confirmado) => {
      if (confirmado === true) {
        this.cerrarSesion();
      }
    });
  }

  seleccionarChat(chat: ChatWhatsapp): void {
    this.chatActivoId.set(chat.id);
  }

  private cargarChats(): void {
    this.servicio.listarChats({ limite: 100 }).subscribe({
      next: (resp) => this.tiempoReal.cargarChats(resp.datos),
      error: () => this.toast.error("No se pudieron cargar los chats"),
    });
  }

  private cerrarSesion(): void {
    this.servicio.cerrarSesion().subscribe({
      next: () => this.toast.success("Sesion de WhatsApp cerrada"),
      error: (err) =>
        this.toast.error(
          err?.error?.message ?? "No se pudo cerrar la sesion de WhatsApp",
        ),
    });
  }
}
