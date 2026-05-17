import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, computed, inject, signal } from "@angular/core";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { DepositosServicio } from "../../nucleo/datos/depositos.servicio";
import { DepositoVendedorDetalle } from "../../nucleo/modelos/deposito.modelo";

@Component({
  selector: "app-deposito-detalle-modal",
  imports: [CommonModule],
  templateUrl: "./deposito-detalle.modal.html",
})
export class DepositoDetalleModal implements OnInit {
  @Input() depositoId!: string;

  readonly modal = inject(NgbActiveModal);
  private readonly servicio = inject(DepositosServicio);

  readonly cargando = signal(true);
  readonly detalle = signal<DepositoVendedorDetalle | null>(null);
  readonly mensajeError = signal<string | null>(null);

  readonly sumaPedidos = computed(() => {
    const d = this.detalle();
    if (!d) return 0;
    return d.pedidos.reduce(
      (acc, p) => acc + this.aNumero(p.montoContraEntrega),
      0,
    );
  });

  ngOnInit(): void {
    this.servicio.obtenerPorId(this.depositoId).subscribe({
      next: (d) => {
        this.detalle.set(d);
        this.cargando.set(false);
      },
      error: (e) => {
        this.mensajeError.set(
          e?.error?.mensaje ?? "No se pudo cargar el detalle del depósito.",
        );
        this.cargando.set(false);
      },
    });
  }

  formatearCuenta(c: DepositoVendedorDetalle["cuentaBancaria"]): string {
    if (!c) return "—";
    const ultimos4 = c.numeroCuenta.slice(-4);
    const tipo = c.tipoCuenta === "AHORRO" ? "Ahorro" : "Corriente";
    return `${c.banco.nombre} · ${tipo} ****${ultimos4}`;
  }

  private aNumero(v: string | number | null | undefined): number {
    if (v === null || v === undefined) return 0;
    if (typeof v === "number") return v;
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
}
