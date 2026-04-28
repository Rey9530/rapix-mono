import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";

import { EditorPoligonoComponente } from "./editor-poligono/editor-poligono.componente";
import { ZonasServicio } from "../../nucleo/datos/zonas.servicio";
import {
  ActualizarZonaPayload,
  CrearZonaPayload,
  PuntoGeo,
  Zona,
} from "../../nucleo/modelos/zona.modelo";

@Component({
  selector: "app-zona-formulario-modal",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EditorPoligonoComponente],
  templateUrl: "./zona-formulario.modal.html",
})
export class ZonaFormularioModal implements OnInit {
  @Input() zonaId: string | null = null;

  readonly modal = inject(NgbActiveModal);
  private readonly fb = inject(FormBuilder);
  private readonly servicio = inject(ZonasServicio);
  private readonly toast = inject(ToastrService);

  cargando = false;
  enviando = false;
  puntos: PuntoGeo[] = [];
  zonaCargada: Zona | null = null;

  readonly form = this.fb.nonNullable.group({
    codigo: ["", [Validators.required, Validators.maxLength(10)]],
    nombre: [
      "",
      [Validators.required, Validators.minLength(2), Validators.maxLength(80)],
    ],
    descripcion: ["", [Validators.maxLength(240)]],
    latitudCentro: [
      0,
      [Validators.required, Validators.min(-90), Validators.max(90)],
    ],
    longitudCentro: [
      0,
      [Validators.required, Validators.min(-180), Validators.max(180)],
    ],
  });

  get esEdicion(): boolean {
    return this.zonaId !== null;
  }

  ngOnInit(): void {
    if (!this.zonaId) return;
    this.cargando = true;
    this.servicio.obtenerPorId(this.zonaId).subscribe({
      next: (z) => {
        this.zonaCargada = z;
        this.puntos = z.poligono ?? [];
        this.form.patchValue({
          codigo: z.codigo,
          nombre: z.nombre,
          descripcion: z.descripcion ?? "",
          latitudCentro: z.latitudCentro,
          longitudCentro: z.longitudCentro,
        });
        this.form.controls.codigo.disable();
        this.cargando = false;
      },
      error: (e) => {
        this.cargando = false;
        this.toast.error(e?.error?.mensaje ?? "No se pudo cargar la zona.");
        this.modal.dismiss();
      },
    });
  }

  alPoligonoCambiar(puntos: PuntoGeo[]): void {
    this.puntos = puntos;
    if (puntos.length >= 3) {
      const centro = this.calcularCentroide(puntos);
      this.form.patchValue({
        latitudCentro: Number(centro.lat.toFixed(6)),
        longitudCentro: Number(centro.lng.toFixed(6)),
      });
    }
  }

  get poligonoValido(): boolean {
    return this.puntos.length >= 3;
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.poligonoValido) {
      this.toast.warning("Dibuja un polígono con al menos 3 puntos.");
      return;
    }
    this.enviando = true;
    const valor = this.form.getRawValue();
    const descripcion = valor.descripcion?.trim() || undefined;

    if (this.esEdicion && this.zonaId) {
      const payload: ActualizarZonaPayload = {
        nombre: valor.nombre,
        descripcion,
        poligono: this.puntos,
        latitudCentro: Number(valor.latitudCentro),
        longitudCentro: Number(valor.longitudCentro),
      };
      this.servicio.actualizar(this.zonaId, payload).subscribe({
        next: () => {
          this.toast.success("Zona actualizada");
          this.modal.close("actualizada");
        },
        error: (e) => this.fallar(e),
      });
      return;
    }

    const payload: CrearZonaPayload = {
      codigo: valor.codigo.trim().toUpperCase(),
      nombre: valor.nombre,
      descripcion,
      poligono: this.puntos,
      latitudCentro: Number(valor.latitudCentro),
      longitudCentro: Number(valor.longitudCentro),
    };
    this.servicio.crear(payload).subscribe({
      next: () => {
        this.toast.success("Zona creada");
        this.modal.close("creada");
      },
      error: (e) => this.fallar(e),
    });
  }

  private calcularCentroide(puntos: PuntoGeo[]): PuntoGeo {
    const total = puntos.reduce(
      (acc, p) => ({ lat: acc.lat + p.lat, lng: acc.lng + p.lng }),
      { lat: 0, lng: 0 },
    );
    return { lat: total.lat / puntos.length, lng: total.lng / puntos.length };
  }

  private fallar(error: {
    error?: { mensaje?: string; message?: string | string[] };
  }): void {
    this.enviando = false;
    const mensaje =
      error.error?.mensaje ??
      (Array.isArray(error.error?.message)
        ? error.error?.message.join(", ")
        : (error.error?.message as string)) ??
      "No se pudo guardar la zona";
    this.toast.error(mensaje);
  }
}
