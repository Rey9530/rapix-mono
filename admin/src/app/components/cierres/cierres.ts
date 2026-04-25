import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";

import { RechazarCierreModal } from "./rechazar-cierre.modal";
import { CierresServicio } from "../../nucleo/datos/cierres.servicio";
import {
  CierreFinanciero,
  EstadoCierreFinanciero,
  FiltrosCierre,
} from "../../nucleo/modelos/cierre.modelo";

@Component({
  selector: "app-cierres",
  imports: [CommonModule, FormsModule],
  templateUrl: "./cierres.html",
  styleUrl: "./cierres.scss",
})
export class Cierres implements OnInit {
  private readonly servicio = inject(CierresServicio);
  private readonly modal = inject(NgbModal);
  private readonly toast = inject(ToastrService);

  readonly cargando = signal(false);
  readonly datos = signal<CierreFinanciero[]>([]);
  readonly total = signal(0);
  readonly totalPaginas = signal(0);
  readonly mensajeError = signal<string | null>(null);

  readonly estados: EstadoCierreFinanciero[] = [
    "PENDIENTE_REVISION",
    "APROBADO",
    "RECHAZADO",
    "CON_DISCREPANCIA",
  ];

  filtros: FiltrosCierre = { pagina: 1, limite: 20 };

  ngOnInit(): void {
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
          e?.error?.mensaje ?? "No se pudieron cargar los cierres.",
        );
      },
    });
  }

  alCambiarEstado(estado: string): void {
    this.filtros = {
      ...this.filtros,
      estado: estado ? (estado as EstadoCierreFinanciero) : undefined,
      pagina: 1,
    };
    this.recargar();
  }

  irPagina(p: number): void {
    if (p < 1 || (this.totalPaginas() && p > this.totalPaginas())) return;
    this.filtros = { ...this.filtros, pagina: p };
    this.recargar();
  }

  aprobar(c: CierreFinanciero): void {
    if (!confirm(`¿Aprobar cierre del ${c.fechaCierre}?`)) return;
    this.servicio.aprobar(c.id).subscribe({
      next: () => {
        this.toast.success("Cierre aprobado");
        this.recargar();
      },
      error: (e) => this.toast.error(e?.error?.mensaje ?? "No se pudo aprobar"),
    });
  }

  rechazar(c: CierreFinanciero): void {
    const ref = this.modal.open(RechazarCierreModal, { centered: true });
    ref.componentInstance.cierreId = c.id;
    ref.closed.subscribe((res) => {
      if (res === "rechazado") this.recargar();
    });
  }

  verFoto(c: CierreFinanciero): void {
    window.open(c.urlComprobanteFoto, "_blank");
  }

  estadoColor(estado: EstadoCierreFinanciero): string {
    switch (estado) {
      case "APROBADO":
        return "success";
      case "RECHAZADO":
        return "danger";
      case "CON_DISCREPANCIA":
        return "warning";
      case "PENDIENTE_REVISION":
      default:
        return "info";
    }
  }

  puedeResolver(c: CierreFinanciero): boolean {
    return c.estado === "PENDIENTE_REVISION" || c.estado === "CON_DISCREPANCIA";
  }
}
