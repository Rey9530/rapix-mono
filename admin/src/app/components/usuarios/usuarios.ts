import { CommonModule } from "@angular/common";
import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Subject, debounceTime } from "rxjs";

import { UsuarioDetalleModal } from "./usuario-detalle.modal";
import { UsuarioFormularioModal } from "./usuario-formulario.modal";
import {
  FiltrosUsuario,
  UsuariosServicio,
} from "../../nucleo/datos/usuarios.servicio";
import {
  EstadoUsuario,
  RolUsuario,
  Usuario,
} from "../../nucleo/modelos/usuario.modelo";

@Component({
  selector: "app-usuarios",
  imports: [CommonModule, FormsModule],
  templateUrl: "./usuarios.html",
  styleUrl: "./usuarios.scss",
})
export class Usuarios implements OnInit {
  private readonly servicio = inject(UsuariosServicio);
  private readonly modal = inject(NgbModal);
  private readonly toast = inject(ToastrService);

  readonly cargando = signal(false);
  readonly datos = signal<Usuario[]>([]);
  readonly total = signal(0);
  readonly totalPaginas = signal(0);
  readonly mensajeError = signal<string | null>(null);
  readonly cantidadPendientes = computed(
    () => this.datos().filter((u) => u.estado === "PENDIENTE_VERIFICACION").length,
  );

  readonly roles: RolUsuario[] = ["ADMIN", "VENDEDOR", "REPARTIDOR", "CLIENTE"];
  readonly estados: EstadoUsuario[] = [
    "ACTIVO",
    "INACTIVO",
    "SUSPENDIDO",
    "PENDIENTE_VERIFICACION",
  ];

  filtros: FiltrosUsuario = { pagina: 1, limite: 20 };
  private readonly busqueda$ = new Subject<string>();

  ngOnInit(): void {
    this.busqueda$.pipe(debounceTime(300)).subscribe((texto) => {
      this.filtros = {
        ...this.filtros,
        busqueda: texto || undefined,
        pagina: 1,
      };
      this.recargar();
    });
    this.recargar();
  }

  recargar(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);
    this.servicio.listar(this.filtros).subscribe({
      next: (r) => {
        this.datos.set(r.datos);
        this.total.set(r.meta.total);
        this.totalPaginas.set(r.meta.totalPaginas);
        this.cargando.set(false);
      },
      error: (e) => {
        this.cargando.set(false);
        this.mensajeError.set(
          e?.error?.mensaje ?? "No se pudieron cargar los usuarios.",
        );
      },
    });
  }

  alBuscar(texto: string): void {
    this.busqueda$.next(texto);
  }

  alCambiarRol(rol: string): void {
    this.filtros = {
      ...this.filtros,
      rol: rol ? (rol as RolUsuario) : undefined,
      pagina: 1,
    };
    this.recargar();
  }

  alCambiarEstado(estado: string): void {
    this.filtros = {
      ...this.filtros,
      estado: estado ? (estado as EstadoUsuario) : undefined,
      pagina: 1,
    };
    this.recargar();
  }

  irPagina(p: number): void {
    if (p < 1 || (this.totalPaginas() && p > this.totalPaginas())) return;
    this.filtros = { ...this.filtros, pagina: p };
    this.recargar();
  }

  abrirCrear(): void {
    const ref = this.modal.open(UsuarioFormularioModal, {
      size: "lg",
      centered: true,
    });
    ref.closed.subscribe((res) => {
      if (res === "creado") this.recargar();
    });
  }

  abrirEditar(usuario: Usuario): void {
    const ref = this.modal.open(UsuarioFormularioModal, {
      size: "lg",
      centered: true,
    });
    ref.componentInstance.usuario = usuario;
    ref.closed.subscribe((res) => {
      if (res === "actualizado") this.recargar();
    });
  }

  abrirDetalle(usuario: Usuario): void {
    const ref = this.modal.open(UsuarioDetalleModal, {
      size: "lg",
      centered: true,
      scrollable: true,
    });
    ref.componentInstance.usuarioId = usuario.id;
  }

  cambiarEstado(
    usuario: Usuario,
    estado: EstadoUsuario,
    motivo?: string,
  ): void {
    this.servicio.cambiarEstado(usuario.id, estado, motivo).subscribe({
      next: () => {
        this.toast.success(`Estado actualizado a ${estado}`);
        this.recargar();
      },
      error: (e) =>
        this.toast.error(e?.error?.mensaje ?? "No se pudo cambiar el estado"),
    });
  }

  verificar(usuario: Usuario): void {
    if (!confirm(`¿Verificar a ${usuario.nombreCompleto} y activar su cuenta?`)) {
      return;
    }
    this.cambiarEstado(usuario, "ACTIVO");
  }

  rechazar(usuario: Usuario): void {
    const motivo = prompt(
      `Rechazar a ${usuario.nombreCompleto}. Motivo (opcional, máx. 240 caracteres):`,
      "",
    );
    if (motivo === null) return;
    this.cambiarEstado(usuario, "INACTIVO", motivo);
  }

  suspender(usuario: Usuario): void {
    const motivo = prompt(
      `Suspender a ${usuario.nombreCompleto}. Motivo (opcional, máx. 240 caracteres):`,
      "",
    );
    if (motivo === null) return;
    this.cambiarEstado(usuario, "SUSPENDIDO", motivo);
  }

  reactivar(usuario: Usuario): void {
    if (!confirm(`¿Reactivar a ${usuario.nombreCompleto}?`)) return;
    this.cambiarEstado(usuario, "ACTIVO");
  }

  filtrarPendientes(): void {
    this.filtros = {
      ...this.filtros,
      estado: "PENDIENTE_VERIFICACION",
      pagina: 1,
    };
    this.recargar();
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
