import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";

import { PedidosServicio } from "../../nucleo/datos/pedidos.servicio";
import { RepartidoresServicio } from "../../nucleo/datos/repartidores.servicio";
import { PerfilRepartidor } from "../../nucleo/modelos/repartidor.modelo";

@Component({
  selector: "app-asignar-pedido-modal",
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./asignar-pedido.modal.html",
})
export class AsignarPedidoModal implements OnInit {
  @Input() pedidoId!: string;
  @Input() codigoSeguimiento = "";

  readonly modal = inject(NgbActiveModal);
  private readonly fb = inject(FormBuilder);
  private readonly servicio = inject(PedidosServicio);
  private readonly repartidoresServicio = inject(RepartidoresServicio);
  private readonly toast = inject(ToastrService);

  repartidores: PerfilRepartidor[] = [];
  enviando = false;

  readonly form = this.fb.nonNullable.group({
    repartidorRecogidaId: ["", [Validators.required]],
    repartidorEntregaId: [""],
  });

  ngOnInit(): void {
    this.repartidoresServicio.listar().subscribe({
      next: (rs) => (this.repartidores = rs.filter((r) => r.disponible)),
      error: () => (this.repartidores = []),
    });
  }

  asignar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando = true;
    const valor = this.form.getRawValue();
    this.servicio
      .asignarManual(this.pedidoId, {
        repartidorRecogidaId: valor.repartidorRecogidaId,
        repartidorEntregaId: valor.repartidorEntregaId || undefined,
      })
      .subscribe({
        next: () => {
          this.toast.success("Pedido asignado");
          this.modal.close("asignado");
        },
        error: (e) => {
          this.enviando = false;
          this.toast.error(e?.error?.mensaje ?? "No se pudo asignar");
        },
      });
  }
}
