import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { ToastrService } from "ngx-toastr";

import { ConfiguracionServicio } from "../../nucleo/datos/configuracion.servicio";
import { AplicacionMovil } from "../../nucleo/modelos/configuracion.modelo";

const PATRON_VERSION = /^\d+\.\d+\.\d+$/;

interface FilaVersionApp {
  aplicacion: AplicacionMovil;
  etiqueta: string;
  descripcion: string;
  versionMinima: string;
  // Valor editable del input, separado del valor guardado.
  versionEditada: string;
  actualizadoEn: string | null;
  cargando: boolean;
  guardando: boolean;
}

@Component({
  selector: "app-configuracion",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./configuracion.html",
})
export class Configuracion implements OnInit {
  private readonly servicio = inject(ConfiguracionServicio);
  private readonly toast = inject(ToastrService);

  readonly mensajeError = signal<string | null>(null);

  readonly filas = signal<FilaVersionApp[]>([
    {
      aplicacion: "CLIENTES",
      etiqueta: "App de clientes (vendedores)",
      descripcion:
        "Versión mínima para crear pedidos. Si la app instalada es menor, " +
        "se bloquea y envía al usuario a Play Store.",
      versionMinima: "—",
      versionEditada: "",
      actualizadoEn: null,
      cargando: true,
      guardando: false,
    },
    {
      aplicacion: "REPARTIDORES",
      etiqueta: "App de repartidores",
      descripcion:
        "La app de repartidores aún no valida esta versión; el valor queda " +
        "listo para cuando se habilite.",
      versionMinima: "—",
      versionEditada: "",
      actualizadoEn: null,
      cargando: true,
      guardando: false,
    },
  ]);

  ngOnInit(): void {
    for (const fila of this.filas()) {
      this.cargar(fila.aplicacion);
    }
  }

  versionValida(version: string): boolean {
    return PATRON_VERSION.test(version.trim());
  }

  guardar(aplicacion: AplicacionMovil): void {
    const fila = this.filas().find((f) => f.aplicacion === aplicacion);
    if (!fila) return;
    const version = fila.versionEditada.trim();
    if (!this.versionValida(version)) {
      this.toast.warning("La versión debe tener formato x.y.z (ej. 1.0.2)");
      return;
    }
    this.actualizarFila(aplicacion, { guardando: true });
    this.servicio
      .actualizarVersionApp(aplicacion, { versionMinima: version })
      .subscribe({
        next: (r) => {
          this.actualizarFila(aplicacion, {
            versionMinima: r.versionMinima,
            versionEditada: r.versionMinima,
            actualizadoEn: r.actualizadoEn ?? null,
            guardando: false,
          });
          this.toast.success(`Versión mínima actualizada a ${r.versionMinima}`);
        },
        error: (e) => {
          this.actualizarFila(aplicacion, { guardando: false });
          this.toast.error(
            e?.error?.mensaje ?? "No se pudo actualizar la versión mínima.",
          );
        },
      });
  }

  alEditar(aplicacion: AplicacionMovil, valor: string): void {
    this.actualizarFila(aplicacion, { versionEditada: valor });
  }

  private cargar(aplicacion: AplicacionMovil): void {
    this.servicio.obtenerVersionApp(aplicacion).subscribe({
      next: (r) => {
        this.actualizarFila(aplicacion, {
          versionMinima: r.versionMinima,
          versionEditada: r.versionMinima,
          actualizadoEn: r.actualizadoEn ?? null,
          cargando: false,
        });
      },
      error: () => {
        this.actualizarFila(aplicacion, { cargando: false });
        this.mensajeError.set(
          "No se pudo cargar la configuración de versiones.",
        );
      },
    });
  }

  private actualizarFila(
    aplicacion: AplicacionMovil,
    cambios: Partial<FilaVersionApp>,
  ): void {
    this.filas.update((filas) =>
      filas.map((f) =>
        f.aplicacion === aplicacion ? { ...f, ...cambios } : f,
      ),
    );
  }
}
