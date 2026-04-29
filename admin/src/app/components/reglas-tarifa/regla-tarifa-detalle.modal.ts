import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, inject, signal } from "@angular/core";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { ReglasTarifaServicio } from "../../nucleo/datos/reglas-tarifa.servicio";
import { ReglaTarifa } from "../../nucleo/modelos/regla-tarifa.modelo";

@Component({
  selector: "app-regla-tarifa-detalle-modal",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./regla-tarifa-detalle.modal.html",
})
export class ReglaTarifaDetalleModal implements OnInit {
  @Input() reglaId!: string;

  readonly modal = inject(NgbActiveModal);
  private readonly servicio = inject(ReglasTarifaServicio);

  readonly cargando = signal(true);
  readonly regla = signal<ReglaTarifa | null>(null);
  readonly mensajeError = signal<string | null>(null);

  ngOnInit(): void {
    this.servicio.obtenerPorId(this.reglaId).subscribe({
      next: (r) => {
        this.regla.set(r);
        this.cargando.set(false);
      },
      error: (e) => {
        this.cargando.set(false);
        this.mensajeError.set(
          e?.error?.mensaje ?? "No se pudo cargar la regla.",
        );
      },
    });
  }
}
