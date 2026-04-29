import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, inject } from "@angular/core";
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";

import { ReglasTarifaServicio } from "../../nucleo/datos/reglas-tarifa.servicio";
import {
  ActualizarReglaTarifaPayload,
  CrearReglaTarifaPayload,
  ModoFacturacion,
} from "../../nucleo/modelos/regla-tarifa.modelo";

@Component({
  selector: "app-regla-tarifa-formulario-modal",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./regla-tarifa-formulario.modal.html",
})
export class ReglaTarifaFormularioModal implements OnInit {
  @Input() reglaId: string | null = null;

  readonly modal = inject(NgbActiveModal);
  private readonly fb = inject(FormBuilder);
  private readonly servicio = inject(ReglasTarifaServicio);
  private readonly toast = inject(ToastrService);

  cargando = false;
  enviando = false;

  readonly form = this.fb.nonNullable.group({
    nombre: [
      "",
      [Validators.required, Validators.minLength(2), Validators.maxLength(120)],
    ],
    modoFacturacion: ["POR_ENVIO" as ModoFacturacion, [Validators.required]],
    precioPorEnvio: [null as number | null, [Validators.min(0)]],
    tamanoPaquete: [null as number | null, [Validators.min(1)]],
    precioPaquete: [null as number | null, [Validators.min(0)]],
    activa: [true],
    validaDesde: [""],
    validaHasta: [""],
  });

  get esEdicion(): boolean {
    return this.reglaId !== null;
  }

  get esModoEnvio(): boolean {
    return this.form.controls.modoFacturacion.value === "POR_ENVIO";
  }

  get esModoPaquete(): boolean {
    return this.form.controls.modoFacturacion.value === "PAQUETE";
  }

  ngOnInit(): void {
    this.form.controls.modoFacturacion.valueChanges.subscribe((modo) => {
      this.aplicarValidadoresSegunModo(modo);
    });
    this.aplicarValidadoresSegunModo(this.form.controls.modoFacturacion.value);

    if (!this.reglaId) return;
    this.cargando = true;
    this.servicio.obtenerPorId(this.reglaId).subscribe({
      next: (r) => {
        this.form.patchValue({
          nombre: r.nombre,
          modoFacturacion: r.modoFacturacion,
          precioPorEnvio:
            r.precioPorEnvio !== null ? Number(r.precioPorEnvio) : null,
          tamanoPaquete: r.tamanoPaquete,
          precioPaquete:
            r.precioPaquete !== null ? Number(r.precioPaquete) : null,
          activa: r.activa,
          validaDesde: r.validaDesde ? r.validaDesde.substring(0, 10) : "",
          validaHasta: r.validaHasta ? r.validaHasta.substring(0, 10) : "",
        });
        this.aplicarValidadoresSegunModo(r.modoFacturacion);
        this.cargando = false;
      },
      error: (e) => {
        this.cargando = false;
        this.toast.error(e?.error?.mensaje ?? "No se pudo cargar la regla.");
        this.modal.dismiss();
      },
    });
  }

  private aplicarValidadoresSegunModo(modo: ModoFacturacion): void {
    const { precioPorEnvio, tamanoPaquete, precioPaquete } = this.form.controls;
    if (modo === "POR_ENVIO") {
      precioPorEnvio.setValidators([Validators.required, Validators.min(0)]);
      tamanoPaquete.clearValidators();
      precioPaquete.clearValidators();
      tamanoPaquete.setValue(null, { emitEvent: false });
      precioPaquete.setValue(null, { emitEvent: false });
    } else {
      precioPorEnvio.clearValidators();
      tamanoPaquete.setValidators([Validators.required, Validators.min(1)]);
      precioPaquete.setValidators([Validators.required, Validators.min(0)]);
      precioPorEnvio.setValue(null, { emitEvent: false });
    }
    precioPorEnvio.updateValueAndValidity({ emitEvent: false });
    tamanoPaquete.updateValueAndValidity({ emitEvent: false });
    precioPaquete.updateValueAndValidity({ emitEvent: false });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando = true;
    const valor = this.form.getRawValue();
    const validaDesde = valor.validaDesde
      ? new Date(valor.validaDesde).toISOString()
      : undefined;
    const validaHasta = valor.validaHasta
      ? new Date(valor.validaHasta).toISOString()
      : null;

    if (this.esEdicion && this.reglaId) {
      const payload: ActualizarReglaTarifaPayload = {
        nombre: valor.nombre,
        modoFacturacion: valor.modoFacturacion,
        precioPorEnvio:
          valor.modoFacturacion === "POR_ENVIO"
            ? Number(valor.precioPorEnvio)
            : null,
        tamanoPaquete:
          valor.modoFacturacion === "PAQUETE"
            ? Number(valor.tamanoPaquete)
            : null,
        precioPaquete:
          valor.modoFacturacion === "PAQUETE"
            ? Number(valor.precioPaquete)
            : null,
        activa: valor.activa,
        ...(validaDesde ? { validaDesde } : {}),
        validaHasta,
      };
      this.servicio.actualizar(this.reglaId, payload).subscribe({
        next: () => {
          this.toast.success("Regla actualizada");
          this.modal.close("actualizada");
        },
        error: (e) => this.fallar(e),
      });
      return;
    }

    const payload: CrearReglaTarifaPayload = {
      nombre: valor.nombre,
      modoFacturacion: valor.modoFacturacion,
      activa: valor.activa,
      ...(validaDesde ? { validaDesde } : {}),
      ...(validaHasta ? { validaHasta } : {}),
    };
    if (valor.modoFacturacion === "POR_ENVIO") {
      payload.precioPorEnvio = Number(valor.precioPorEnvio);
    } else {
      payload.tamanoPaquete = Number(valor.tamanoPaquete);
      payload.precioPaquete = Number(valor.precioPaquete);
    }
    this.servicio.crear(payload).subscribe({
      next: () => {
        this.toast.success("Regla creada");
        this.modal.close("creada");
      },
      error: (e) => this.fallar(e),
    });
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
      "No se pudo guardar la regla";
    this.toast.error(mensaje);
  }
}
