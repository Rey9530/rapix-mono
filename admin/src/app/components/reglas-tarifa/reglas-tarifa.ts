import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Subject, debounceTime } from "rxjs";

import { ReglasTarifaServicio } from "../../nucleo/datos/reglas-tarifa.servicio";
import {
  FiltrosReglaTarifa,
  ModoFacturacion,
  ReglaTarifa,
} from "../../nucleo/modelos/regla-tarifa.modelo";
import { ReglaTarifaDetalleModal } from "./regla-tarifa-detalle.modal";
import { ReglaTarifaFormularioModal } from "./regla-tarifa-formulario.modal";

@Component({
  selector: "app-reglas-tarifa",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./reglas-tarifa.html",
})
export class ReglasTarifa implements OnInit {
  private readonly servicio = inject(ReglasTarifaServicio);
  private readonly modal = inject(NgbModal);
  private readonly toast = inject(ToastrService);

  readonly cargando = signal(false);
  readonly datos = signal<ReglaTarifa[]>([]);
  readonly total = signal(0);
  readonly totalPaginas = signal(0);
  readonly mensajeError = signal<string | null>(null);

  readonly modos: ModoFacturacion[] = ["POR_ENVIO", "PAQUETE"];

  filtros: FiltrosReglaTarifa = { pagina: 1, limite: 20 };
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
          e?.error?.mensaje ?? "No se pudieron cargar las reglas de tarifa.",
        );
      },
    });
  }

  alBuscar(texto: string): void {
    this.busqueda$.next(texto);
  }

  alCambiarModo(modo: string): void {
    this.filtros = {
      ...this.filtros,
      modoFacturacion: modo ? (modo as ModoFacturacion) : undefined,
      pagina: 1,
    };
    this.recargar();
  }

  alCambiarActiva(valor: string): void {
    let activa: boolean | undefined;
    if (valor === "true") activa = true;
    else if (valor === "false") activa = false;
    this.filtros = { ...this.filtros, activa, pagina: 1 };
    this.recargar();
  }

  irPagina(p: number): void {
    if (p < 1 || (this.totalPaginas() && p > this.totalPaginas())) return;
    this.filtros = { ...this.filtros, pagina: p };
    this.recargar();
  }

  abrirCrear(): void {
    const ref = this.modal.open(ReglaTarifaFormularioModal, {
      size: "lg",
      centered: true,
    });
    ref.closed.subscribe((res) => {
      if (res === "creada") this.recargar();
    });
  }

  abrirEditar(regla: ReglaTarifa): void {
    const ref = this.modal.open(ReglaTarifaFormularioModal, {
      size: "lg",
      centered: true,
    });
    ref.componentInstance.reglaId = regla.id;
    ref.closed.subscribe((res) => {
      if (res === "actualizada") this.recargar();
    });
  }

  abrirDetalle(regla: ReglaTarifa): void {
    const ref = this.modal.open(ReglaTarifaDetalleModal, {
      size: "lg",
      centered: true,
    });
    ref.componentInstance.reglaId = regla.id;
  }

  desactivar(regla: ReglaTarifa): void {
    if (
      !confirm(
        `¿Desactivar la regla "${regla.nombre}"? Quedará oculta del catálogo.`,
      )
    ) {
      return;
    }
    this.servicio.desactivar(regla.id).subscribe({
      next: () => {
        this.toast.success("Regla desactivada");
        this.recargar();
      },
      error: (e) =>
        this.toast.error(
          e?.error?.mensaje ?? "No se pudo desactivar la regla",
        ),
    });
  }

  activar(regla: ReglaTarifa): void {
    this.servicio.activar(regla.id).subscribe({
      next: () => {
        this.toast.success("Regla activada");
        this.recargar();
      },
      error: (e) =>
        this.toast.error(e?.error?.mensaje ?? "No se pudo activar la regla"),
    });
  }

  formatearPrecio(regla: ReglaTarifa): string {
    if (regla.modoFacturacion === "POR_ENVIO") {
      const valor = regla.precioPorEnvio;
      return valor !== null && valor !== undefined
        ? `$${Number(valor).toFixed(2)} / envío`
        : "—";
    }
    const precio = regla.precioPaquete;
    const tamano = regla.tamanoPaquete;
    if (precio === null || tamano === null) return "—";
    return `$${Number(precio).toFixed(2)} (${tamano} envíos)`;
  }
}
