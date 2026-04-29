import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, inject, signal } from "@angular/core";
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";

import { ReglasTarifaServicio } from "../../nucleo/datos/reglas-tarifa.servicio";
import { UsuariosServicio } from "../../nucleo/datos/usuarios.servicio";
import {
  ActualizarPaqueteAsignadoPayload,
  AsignarPaquetePayload,
  PaqueteRecargado,
} from "../../nucleo/modelos/paquete-recargado.modelo";
import { ReglaTarifa } from "../../nucleo/modelos/regla-tarifa.modelo";

interface ReglaPaqueteResumen {
  id: string;
  nombre: string;
  tamanoPaquete: number;
  precioPaquete: number;
}

@Component({
  selector: "app-vendedor-paquetes-modal",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./vendedor-paquetes.modal.html",
})
export class VendedorPaquetesModal implements OnInit {
  @Input() usuarioId!: string;
  @Input() nombreVendedor = "";

  readonly modal = inject(NgbActiveModal);
  private readonly fb = inject(FormBuilder);
  private readonly servicio = inject(UsuariosServicio);
  private readonly reglas = inject(ReglasTarifaServicio);
  private readonly toast = inject(ToastrService);

  readonly cargando = signal(true);
  readonly enviando = signal(false);
  readonly paquetes = signal<PaqueteRecargado[]>([]);
  readonly reglasDisponibles = signal<ReglaPaqueteResumen[]>([]);
  readonly mensajeError = signal<string | null>(null);
  readonly modoFormulario = signal<"oculto" | "asignar" | "editar">("oculto");
  readonly paqueteEditandoId = signal<string | null>(null);

  readonly formAsignar = this.fb.nonNullable.group({
    reglaTarifaId: ["", [Validators.required]],
    enviosTotales: [null as number | null, [Validators.min(1)]],
    enviosRestantes: [null as number | null, [Validators.min(0)]],
    precio: [null as number | null, [Validators.min(0)]],
    expiraEn: [""],
    notas: [""],
  });

  readonly formEditar = this.fb.nonNullable.group({
    enviosRestantes: [0, [Validators.required, Validators.min(0)]],
    estado: ["ACTIVO" as PaqueteRecargado["estado"]],
    expiraEn: [""],
    notas: [""],
  });

  readonly estadosPaquete: PaqueteRecargado["estado"][] = [
    "ACTIVO",
    "AGOTADO",
    "EXPIRADO",
    "CANCELADO",
    "PENDIENTE_PAGO",
  ];

  ngOnInit(): void {
    this.recargar();
    this.reglas.listar({ modoFacturacion: "PAQUETE", activa: true, limite: 100 }).subscribe({
      next: (r) => {
        this.reglasDisponibles.set(
          r.datos
            .filter(
              (x: ReglaTarifa) =>
                x.tamanoPaquete !== null && x.precioPaquete !== null,
            )
            .map((x) => ({
              id: x.id,
              nombre: x.nombre,
              tamanoPaquete: x.tamanoPaquete as number,
              precioPaquete: Number(x.precioPaquete),
            })),
        );
      },
      error: () => {
        this.toast.warning("No se pudieron cargar las reglas de tarifa.");
      },
    });
  }

  recargar(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);
    this.servicio.listarPaquetesAsignados(this.usuarioId, 1, 50).subscribe({
      next: (r) => {
        this.paquetes.set(r.datos);
        this.cargando.set(false);
      },
      error: (e) => {
        this.cargando.set(false);
        this.mensajeError.set(
          e?.error?.mensaje ?? "No se pudieron cargar los paquetes asignados.",
        );
      },
    });
  }

  abrirAsignar(): void {
    this.formAsignar.reset({
      reglaTarifaId: "",
      enviosTotales: null,
      enviosRestantes: null,
      precio: null,
      expiraEn: "",
      notas: "",
    });
    this.paqueteEditandoId.set(null);
    this.modoFormulario.set("asignar");
  }

  cancelarFormulario(): void {
    this.modoFormulario.set("oculto");
    this.paqueteEditandoId.set(null);
  }

  alSeleccionarRegla(reglaId: string): void {
    const regla = this.reglasDisponibles().find((r) => r.id === reglaId);
    if (!regla) return;
    if (this.formAsignar.controls.enviosTotales.value === null) {
      this.formAsignar.controls.enviosTotales.setValue(regla.tamanoPaquete);
    }
    if (this.formAsignar.controls.precio.value === null) {
      this.formAsignar.controls.precio.setValue(regla.precioPaquete);
    }
  }

  guardarAsignacion(): void {
    if (this.formAsignar.invalid) {
      this.formAsignar.markAllAsTouched();
      return;
    }
    const v = this.formAsignar.getRawValue();
    if (
      v.enviosTotales !== null &&
      v.enviosRestantes !== null &&
      v.enviosRestantes > v.enviosTotales
    ) {
      this.toast.warning(
        "Los envíos restantes no pueden superar los totales.",
      );
      return;
    }
    const payload: AsignarPaquetePayload = {
      reglaTarifaId: v.reglaTarifaId,
      ...(v.enviosTotales !== null ? { enviosTotales: v.enviosTotales } : {}),
      ...(v.enviosRestantes !== null
        ? { enviosRestantes: v.enviosRestantes }
        : {}),
      ...(v.precio !== null ? { precio: v.precio } : {}),
      ...(v.expiraEn ? { expiraEn: new Date(v.expiraEn).toISOString() } : {}),
      ...(v.notas?.trim() ? { notas: v.notas.trim() } : {}),
    };
    this.enviando.set(true);
    this.servicio.asignarPaquete(this.usuarioId, payload).subscribe({
      next: () => {
        this.toast.success("Paquete asignado");
        this.enviando.set(false);
        this.modoFormulario.set("oculto");
        this.recargar();
      },
      error: (e) => this.fallar(e, "No se pudo asignar el paquete"),
    });
  }

  abrirEditar(paquete: PaqueteRecargado): void {
    this.paqueteEditandoId.set(paquete.id);
    this.formEditar.reset({
      enviosRestantes: paquete.enviosRestantes,
      estado: paquete.estado,
      expiraEn: paquete.expiraEn ? paquete.expiraEn.substring(0, 10) : "",
      notas: "",
    });
    this.modoFormulario.set("editar");
  }

  guardarEdicion(): void {
    if (this.formEditar.invalid) {
      this.formEditar.markAllAsTouched();
      return;
    }
    const id = this.paqueteEditandoId();
    if (!id) return;
    const original = this.paquetes().find((p) => p.id === id);
    const v = this.formEditar.getRawValue();
    const payload: ActualizarPaqueteAsignadoPayload = {};
    if (original && v.enviosRestantes !== original.enviosRestantes) {
      payload.enviosRestantes = v.enviosRestantes;
    } else if (!original) {
      payload.enviosRestantes = v.enviosRestantes;
    }
    if (original && v.estado !== original.estado) payload.estado = v.estado;
    const expiraOriginal = original?.expiraEn
      ? original.expiraEn.substring(0, 10)
      : "";
    if (v.expiraEn !== expiraOriginal) {
      payload.expiraEn = v.expiraEn ? new Date(v.expiraEn).toISOString() : null;
    }
    if (v.notas?.trim()) payload.notas = v.notas.trim();

    if (Object.keys(payload).length === 0) {
      this.toast.info("No hay cambios para guardar.");
      this.modoFormulario.set("oculto");
      return;
    }
    this.enviando.set(true);
    this.servicio
      .actualizarPaqueteAsignado(this.usuarioId, id, payload)
      .subscribe({
        next: () => {
          this.toast.success("Paquete actualizado");
          this.enviando.set(false);
          this.modoFormulario.set("oculto");
          this.recargar();
        },
        error: (e) => this.fallar(e, "No se pudo actualizar el paquete"),
      });
  }

  cancelar(paquete: PaqueteRecargado): void {
    if (
      !confirm(
        `¿Cancelar el paquete "${paquete.nombre}"? Esta acción se guarda en auditoría.`,
      )
    ) {
      return;
    }
    this.servicio
      .actualizarPaqueteAsignado(this.usuarioId, paquete.id, {
        estado: "CANCELADO",
        notas: "Cancelado desde panel admin",
      })
      .subscribe({
        next: () => {
          this.toast.success("Paquete cancelado");
          this.recargar();
        },
        error: (e) =>
          this.toast.error(
            e?.error?.mensaje ?? "No se pudo cancelar el paquete",
          ),
      });
  }

  estadoColor(estado: PaqueteRecargado["estado"]): string {
    switch (estado) {
      case "ACTIVO":
        return "success";
      case "AGOTADO":
        return "secondary";
      case "EXPIRADO":
        return "warning";
      case "CANCELADO":
        return "danger";
      case "PENDIENTE_PAGO":
        return "info";
      default:
        return "secondary";
    }
  }

  private fallar(
    error: { error?: { mensaje?: string; message?: string | string[] } },
    fallback: string,
  ): void {
    this.enviando.set(false);
    const mensaje =
      error.error?.mensaje ??
      (Array.isArray(error.error?.message)
        ? error.error?.message.join(", ")
        : (error.error?.message as string)) ??
      fallback;
    this.toast.error(mensaje);
  }
}
