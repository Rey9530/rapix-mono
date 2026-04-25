import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, signal } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";

import { PedidosServicio } from "../../../nucleo/datos/pedidos.servicio";
import { PedidoDetalle } from "../../../nucleo/modelos/pedido.modelo";

@Component({
  selector: "app-detalle-pedido",
  imports: [CommonModule, RouterModule],
  templateUrl: "./detalle-pedido.html",
  styleUrl: "./detalle-pedido.scss",
})
export class DetallePedido implements OnInit {
  private readonly ruta = inject(ActivatedRoute);
  private readonly servicio = inject(PedidosServicio);

  readonly cargando = signal(true);
  readonly pedido = signal<PedidoDetalle | null>(null);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.ruta.snapshot.paramMap.get("id");
    if (!id) {
      this.error.set("ID de pedido no provisto.");
      this.cargando.set(false);
      return;
    }
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
}
