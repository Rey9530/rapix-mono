import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, inject, signal } from "@angular/core";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { EditorPoligonoComponente } from "./editor-poligono/editor-poligono.componente";
import { ZonasServicio } from "../../nucleo/datos/zonas.servicio";
import { Zona } from "../../nucleo/modelos/zona.modelo";

@Component({
  selector: "app-zona-detalle-modal",
  standalone: true,
  imports: [CommonModule, EditorPoligonoComponente],
  templateUrl: "./zona-detalle.modal.html",
})
export class ZonaDetalleModal implements OnInit {
  @Input() zonaId!: string;

  readonly modal = inject(NgbActiveModal);
  private readonly servicio = inject(ZonasServicio);

  readonly cargando = signal(true);
  readonly zona = signal<Zona | null>(null);
  readonly mensajeError = signal<string | null>(null);

  ngOnInit(): void {
    this.servicio.obtenerPorId(this.zonaId).subscribe({
      next: (z) => {
        this.zona.set(z);
        this.cargando.set(false);
      },
      error: (e) => {
        this.cargando.set(false);
        this.mensajeError.set(
          e?.error?.mensaje ?? "No se pudo cargar la zona.",
        );
      },
    });
  }
}
