import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, inject, signal } from "@angular/core";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { UsuariosServicio } from "../../nucleo/datos/usuarios.servicio";
import {
  EstadoUsuario,
  UsuarioDetalle,
} from "../../nucleo/modelos/usuario.modelo";

@Component({
  selector: "app-usuario-detalle-modal",
  imports: [CommonModule],
  templateUrl: "./usuario-detalle.modal.html",
})
export class UsuarioDetalleModal implements OnInit {
  @Input() usuarioId!: string;

  readonly modal = inject(NgbActiveModal);
  private readonly servicio = inject(UsuariosServicio);

  readonly cargando = signal(true);
  readonly detalle = signal<UsuarioDetalle | null>(null);
  readonly mensajeError = signal<string | null>(null);

  ngOnInit(): void {
    this.servicio.obtenerPorId(this.usuarioId).subscribe({
      next: (d) => {
        this.detalle.set(d);
        this.cargando.set(false);
      },
      error: (e) => {
        this.mensajeError.set(
          e?.error?.mensaje ?? "No se pudo cargar el detalle del usuario.",
        );
        this.cargando.set(false);
      },
    });
  }

  iniciales(nombre: string | undefined | null): string {
    if (!nombre) return "?";
    const partes = nombre.trim().split(/\s+/).slice(0, 2);
    return partes.map((p) => p.charAt(0).toUpperCase()).join("") || "?";
  }

  estadoColor(estado: EstadoUsuario): string {
    switch (estado) {
      case "ACTIVO":
        return "success";
      case "SUSPENDIDO":
        return "danger";
      case "INACTIVO":
        return "secondary";
      case "PENDIENTE_VERIFICACION":
        return "warning";
      default:
        return "secondary";
    }
  }
}
