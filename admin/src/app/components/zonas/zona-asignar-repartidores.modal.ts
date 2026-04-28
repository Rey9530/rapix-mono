import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";

import { RepartidoresServicio } from "../../nucleo/datos/repartidores.servicio";
import { ZonasServicio } from "../../nucleo/datos/zonas.servicio";
import { PerfilRepartidor } from "../../nucleo/modelos/repartidor.modelo";

@Component({
  selector: "app-zona-asignar-repartidores-modal",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./zona-asignar-repartidores.modal.html",
})
export class ZonaAsignarRepartidoresModal implements OnInit {
  @Input() zonaId!: string;
  @Input() codigoZona = "";

  readonly modal = inject(NgbActiveModal);
  private readonly repartidoresServicio = inject(RepartidoresServicio);
  private readonly zonasServicio = inject(ZonasServicio);
  private readonly toast = inject(ToastrService);

  readonly cargando = signal(true);
  readonly mensajeError = signal<string | null>(null);
  readonly enviando = signal(false);
  readonly repartidores = signal<PerfilRepartidor[]>([]);

  // Estado: id repartidor → seleccionado.
  seleccionados = new Set<string>();
  primarioId = "";

  ngOnInit(): void {
    this.repartidoresServicio.listar().subscribe({
      next: (lista) => {
        this.repartidores.set(lista);
        // Pre-marcar los ya asignados a esta zona y el primario actual.
        lista.forEach((r) => {
          const enZona = r.zonas?.find((z) => z.id === this.zonaId);
          if (enZona) {
            this.seleccionados.add(r.id);
            if (enZona.esPrimaria) this.primarioId = r.id;
          }
        });
        this.cargando.set(false);
      },
      error: (e) => {
        this.cargando.set(false);
        this.mensajeError.set(
          e?.error?.mensaje ?? "No se pudieron cargar los repartidores.",
        );
      },
    });
  }

  estaSeleccionado(id: string): boolean {
    return this.seleccionados.has(id);
  }

  alAlternar(id: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.seleccionados.add(id);
    } else {
      this.seleccionados.delete(id);
      if (this.primarioId === id) this.primarioId = "";
    }
  }

  alElegirPrimario(id: string): void {
    if (!this.seleccionados.has(id)) return;
    this.primarioId = id;
  }

  guardar(): void {
    if (this.seleccionados.size === 0) {
      this.toast.warning("Selecciona al menos un repartidor.");
      return;
    }
    if (this.primarioId && !this.seleccionados.has(this.primarioId)) {
      this.toast.warning("El primario debe estar entre los seleccionados.");
      return;
    }
    this.enviando.set(true);
    this.zonasServicio
      .asignarRepartidores(this.zonaId, {
        repartidorIds: Array.from(this.seleccionados),
        repartidorPrimarioId: this.primarioId || undefined,
      })
      .subscribe({
        next: (res) => {
          this.toast.success(
            `${res.asignados} repartidor(es) asignado(s) a la zona.`,
          );
          this.modal.close("asignados");
        },
        error: (e) => {
          this.enviando.set(false);
          const mensaje =
            e?.error?.mensaje ??
            (Array.isArray(e?.error?.message)
              ? e.error.message.join(", ")
              : (e?.error?.message as string)) ??
            "No se pudieron asignar los repartidores.";
          this.toast.error(mensaje);
        },
      });
  }
}
