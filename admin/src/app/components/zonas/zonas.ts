import { CommonModule } from "@angular/common";
import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Subject, debounceTime } from "rxjs";
import Swal from "sweetalert2";

import { ZonaAsignarRepartidoresModal } from "./zona-asignar-repartidores.modal";
import { ZonaDetalleModal } from "./zona-detalle.modal";
import { ZonaFormularioModal } from "./zona-formulario.modal";
import { ZonasServicio } from "../../nucleo/datos/zonas.servicio";
import { Zona } from "../../nucleo/modelos/zona.modelo";

@Component({
  selector: "app-zonas",
  imports: [CommonModule, FormsModule],
  templateUrl: "./zonas.html",
  styleUrl: "./zonas.scss",
})
export class Zonas implements OnInit {
  private readonly servicio = inject(ZonasServicio);
  private readonly modal = inject(NgbModal);
  private readonly toast = inject(ToastrService);

  readonly cargando = signal(false);
  readonly datos = signal<Zona[]>([]);
  readonly mensajeError = signal<string | null>(null);
  readonly textoBusqueda = signal("");
  readonly incluirInactivas = signal(false);

  readonly datosFiltrados = computed(() => {
    const texto = this.textoBusqueda().trim().toLowerCase();
    if (!texto) return this.datos();
    return this.datos().filter((z) => {
      const codigo = z.codigo?.toLowerCase() ?? "";
      const nombre = z.nombre?.toLowerCase() ?? "";
      const descripcion = z.descripcion?.toLowerCase() ?? "";
      return (
        codigo.includes(texto) ||
        nombre.includes(texto) ||
        descripcion.includes(texto)
      );
    });
  });

  private readonly busqueda$ = new Subject<string>();

  ngOnInit(): void {
    this.busqueda$.pipe(debounceTime(300)).subscribe((texto) => {
      this.textoBusqueda.set(texto);
    });
    this.recargar();
  }

  recargar(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);
    this.servicio.listar(this.incluirInactivas()).subscribe({
      next: (r) => {
        this.datos.set(r);
        this.cargando.set(false);
      },
      error: (e) => {
        this.cargando.set(false);
        this.mensajeError.set(
          e?.error?.mensaje ?? "No se pudieron cargar las zonas.",
        );
      },
    });
  }

  alBuscar(texto: string): void {
    this.busqueda$.next(texto);
  }

  alAlternarInactivas(valor: boolean): void {
    this.incluirInactivas.set(valor);
    this.recargar();
  }

  abrirCrear(): void {
    const ref = this.modal.open(ZonaFormularioModal, {
      size: "xl",
      centered: true,
      backdrop: "static",
    });
    ref.closed.subscribe((res) => {
      if (res === "creada") this.recargar();
    });
  }

  abrirEditar(zona: Zona): void {
    const ref = this.modal.open(ZonaFormularioModal, {
      size: "xl",
      centered: true,
      backdrop: "static",
    });
    ref.componentInstance.zonaId = zona.id;
    ref.closed.subscribe((res) => {
      if (res === "actualizada") this.recargar();
    });
  }

  abrirDetalle(zona: Zona): void {
    const ref = this.modal.open(ZonaDetalleModal, {
      size: "xl",
      centered: true,
      scrollable: true,
    });
    ref.componentInstance.zonaId = zona.id;
  }

  abrirAsignarRepartidores(zona: Zona): void {
    const ref = this.modal.open(ZonaAsignarRepartidoresModal, {
      size: "lg",
      centered: true,
      scrollable: true,
    });
    ref.componentInstance.zonaId = zona.id;
    ref.componentInstance.codigoZona = zona.codigo;
  }

  async eliminar(zona: Zona): Promise<void> {
    const r = await Swal.fire({
      icon: "warning",
      title: "¿Desactivar zona?",
      html: `La zona <strong>${zona.codigo} — ${zona.nombre}</strong> quedará inactiva. Podrás reactivarla más tarde.`,
      showCancelButton: true,
      confirmButtonText: "Desactivar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });
    if (!r.isConfirmed) return;

    this.servicio.eliminar(zona.id).subscribe({
      next: () => {
        this.toast.success("Zona desactivada");
        this.recargar();
      },
      error: (e) => {
        this.toast.error(e?.error?.mensaje ?? "No se pudo desactivar la zona.");
      },
    });
  }

  formatearCentro(zona: Zona): string {
    const lat = zona.latitudCentro?.toFixed(4) ?? "—";
    const lng = zona.longitudCentro?.toFixed(4) ?? "—";
    return `${lat}, ${lng}`;
  }
}
