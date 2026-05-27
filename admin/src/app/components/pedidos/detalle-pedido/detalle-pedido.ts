import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, signal } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { PedidosServicio } from "../../../nucleo/datos/pedidos.servicio";
import { PedidoDetalle } from "../../../nucleo/modelos/pedido.modelo";
import { ImagenPedidoModal } from "./imagen-pedido.modal";
import { MapaPedidoModal } from "./mapa-pedido.modal";
import { PedidoFormularioModal } from "./pedido-formulario.modal";

@Component({
  selector: "app-detalle-pedido",
  imports: [CommonModule, RouterModule],
  templateUrl: "./detalle-pedido.html",
  styleUrl: "./detalle-pedido.scss",
})
export class DetallePedido implements OnInit {
  private readonly ruta = inject(ActivatedRoute);
  private readonly servicio = inject(PedidosServicio);
  private readonly modalServicio = inject(NgbModal);

  readonly cargando = signal(true);
  readonly pedido = signal<PedidoDetalle | null>(null);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.recargar();
  }

  private recargar(): void {
    const id = this.ruta.snapshot.paramMap.get("id");
    if (!id) {
      this.error.set("ID de pedido no provisto.");
      this.cargando.set(false);
      return;
    }
    this.cargando.set(true);
    this.servicio.obtenerPorId(id).subscribe({
      next: (p) => {
        this.pedido.set(p);
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(e?.error?.mensaje ?? "No se pudo cargar el pedido.");
        this.cargando.set(false);
      },
    });
  }

  abrirEditar(): void {
    const p = this.pedido();
    if (!p) return;
    const ref = this.modalServicio.open(PedidoFormularioModal, {
      size: "lg",
      centered: true,
      scrollable: true,
    });
    ref.componentInstance.pedido = p;
    ref.closed.subscribe((res) => {
      if (res === "actualizado") this.recargar();
    });
  }

  abrirMapa(): void {
    const p = this.pedido();
    if (!p) return;
    const ref = this.modalServicio.open(MapaPedidoModal, {
      size: "lg",
      centered: true,
    });
    ref.componentInstance.pedido = p;
  }

  abrirImagen(url: string, titulo = "Imagen"): void {
    const ref = this.modalServicio.open(ImagenPedidoModal, {
      size: "lg",
      centered: true,
    });
    ref.componentInstance.urlImagen = url;
    ref.componentInstance.titulo = titulo;
  }
}
