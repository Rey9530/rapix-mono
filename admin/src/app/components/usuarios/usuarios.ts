import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Subject, debounceTime } from "rxjs";

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

  cambiarEstado(usuario: Usuario, estado: EstadoUsuario): void {
    if (
      !confirm(
        `¿Cambiar a ${usuario.nombreCompleto} de ${usuario.estado} → ${estado}?`,
      )
    ) {
      return;
    }
    this.servicio.cambiarEstado(usuario.id, estado).subscribe({
      next: () => {
        this.toast.success(`Estado actualizado a ${estado}`);
        this.recargar();
      },
      error: (e) =>
        this.toast.error(e?.error?.mensaje ?? "No se pudo cambiar el estado"),
    });
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
