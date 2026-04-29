import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Subject, debounceTime } from "rxjs";

import { AsignarPedidoModal } from "./asignar-pedido.modal";
import { AsignarRetirosZonaModal } from "./asignar-retiros-zona.modal";
import { PedidosServicio } from "../../nucleo/datos/pedidos.servicio";
import { ZonasServicio } from "../../nucleo/datos/zonas.servicio";
import {
  EstadoPedido,
  FiltrosPedido,
  Pedido,
} from "../../nucleo/modelos/pedido.modelo";
import { Zona } from "../../nucleo/modelos/zona.modelo";

@Component({
  selector: "app-pedidos",
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./pedidos.html",
  styleUrl: "./pedidos.scss",
})
export class Pedidos implements OnInit {
  private readonly servicio = inject(PedidosServicio);
  private readonly zonasServicio = inject(ZonasServicio);
  private readonly modal = inject(NgbModal);
  private readonly toast = inject(ToastrService);

  readonly cargando = signal(false);
  readonly datos = signal<Pedido[]>([]);
  readonly total = signal(0);
  readonly totalPaginas = signal(0);
  readonly mensajeError = signal<string | null>(null);
  readonly zonas = signal<Zona[]>([]);

  readonly estados: EstadoPedido[] = [
    "PENDIENTE_ASIGNACION",
    "ASIGNADO",
    "RECOGIDO",
    "EN_TRANSITO",
    "EN_PUNTO_INTERCAMBIO",
    "EN_REPARTO",
    "ENTREGADO",
    "CANCELADO",
    "FALLIDO",
    "DEVUELTO",
  ];

  filtros: FiltrosPedido = { pagina: 1, limite: 20 };
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
    this.zonasServicio.listar().subscribe({
      next: (zs) => this.zonas.set(zs),
      error: () => this.zonas.set([]),
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
          e?.error?.mensaje ?? "No se pudieron cargar los pedidos.",
        );
      },
    });
  }

  alBuscar(texto: string): void {
    this.busqueda$.next(texto);
  }

  alCambiarEstado(estado: string): void {
    this.filtros = {
      ...this.filtros,
      estado: estado ? (estado as EstadoPedido) : undefined,
      pagina: 1,
    };
    this.recargar();
  }

  alCambiarZona(zonaId: string): void {
    this.filtros = {
      ...this.filtros,
      zonaId: zonaId || undefined,
      pagina: 1,
    };
    this.recargar();
  }

  irPagina(p: number): void {
    if (p < 1 || (this.totalPaginas() && p > this.totalPaginas())) return;
    this.filtros = { ...this.filtros, pagina: p };
    this.recargar();
  }

  asignarAutomatico(): void {
    this.servicio.asignarAutomatico().subscribe({
      next: (r) => {
        this.toast.success(
          `Asignados: ${r.asignados} / ${r.procesados}. Pendientes: ${r.pendientes}.`,
        );
        this.recargar();
      },
      error: (e) =>
        this.toast.error(
          e?.error?.mensaje ?? "No se pudo ejecutar la asignación",
        ),
    });
  }

  abrirAsignarManual(p: Pedido): void {
    const ref = this.modal.open(AsignarPedidoModal, {
      size: "lg",
      centered: true,
    });
    ref.componentInstance.pedidoId = p.id;
    ref.componentInstance.codigoSeguimiento = p.codigoSeguimiento;
    ref.closed.subscribe((res) => {
      if (res === "asignado") this.recargar();
    });
  }

  abrirAsignarRetirosZona(): void {
    const ref = this.modal.open(AsignarRetirosZonaModal, {
      size: "xl",
      centered: true,
      backdrop: "static",
    });
    ref.closed.subscribe((res) => {
      if (res === "asignado") this.recargar();
    });
  }

  cancelar(p: Pedido): void {
    const motivo = prompt(`Motivo de cancelación para ${p.codigoSeguimiento}:`);
    if (!motivo) return;
    this.servicio.cancelar(p.id, motivo).subscribe({
      next: () => {
        this.toast.success("Pedido cancelado");
        this.recargar();
      },
      error: (e) =>
        this.toast.error(e?.error?.mensaje ?? "No se pudo cancelar"),
    });
  }

  estadoColor(estado: EstadoPedido): string {
    switch (estado) {
      case "ENTREGADO":
        return "success";
      case "CANCELADO":
      case "FALLIDO":
      case "DEVUELTO":
        return "danger";
      case "PENDIENTE_ASIGNACION":
        return "secondary";
      case "ASIGNADO":
      case "RECOGIDO":
      case "EN_TRANSITO":
      case "EN_PUNTO_INTERCAMBIO":
      case "EN_REPARTO":
        return "info";
      default:
        return "secondary";
    }
  }

  puedeAsignar(p: Pedido): boolean {
    return p.estado === "PENDIENTE_ASIGNACION";
  }

  puedeCancelar(p: Pedido): boolean {
    return ["PENDIENTE_ASIGNACION", "ASIGNADO"].includes(p.estado);
  }
}
