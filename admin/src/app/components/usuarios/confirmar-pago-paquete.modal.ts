import { CommonModule } from "@angular/common";
import { Component, Input, inject, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";

import { UsuariosServicio } from "../../nucleo/datos/usuarios.servicio";
import { PaqueteRecargado } from "../../nucleo/modelos/paquete-recargado.modelo";

@Component({
  selector: "app-confirmar-pago-paquete-modal",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./confirmar-pago-paquete.modal.html",
})
export class ConfirmarPagoPaqueteModal {
  @Input({ required: true }) paquete!: PaqueteRecargado;
  @Input({ required: true }) usuarioId!: string;
  @Input() nombreVendedor = "";

  readonly modal = inject(NgbActiveModal);
  private readonly servicio = inject(UsuariosServicio);
  private readonly toast = inject(ToastrService);

  readonly enviando = signal(false);
  readonly notas = new FormControl<string>("", {
    nonNullable: true,
    validators: [Validators.maxLength(240)],
  });

  get esPendientePago(): boolean {
    return this.paquete.estado === "PENDIENTE_PAGO";
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

  autorizar(): void {
    const nota = this.notas.value.trim() || "Comprobante verificado";
    this.aplicarCambio("ACTIVO", nota, "Pago autorizado");
  }

  rechazar(): void {
    if (
      !confirm(
        "Esto cancela el paquete y no se puede revertir. ¿Continuar?",
      )
    ) {
      return;
    }
    const nota = this.notas.value.trim() || "Comprobante rechazado";
    this.aplicarCambio("CANCELADO", nota, "Pago rechazado");
  }

  private aplicarCambio(
    estado: PaqueteRecargado["estado"],
    notas: string,
    mensajeExito: string,
  ): void {
    this.enviando.set(true);
    this.servicio
      .actualizarPaqueteAsignado(this.usuarioId, this.paquete.id, {
        estado,
        notas,
      })
      .subscribe({
        next: () => {
          this.enviando.set(false);
          this.toast.success(mensajeExito);
          this.modal.close(true);
        },
        error: (e: {
          error?: { mensaje?: string; message?: string | string[] };
        }) => {
          this.enviando.set(false);
          const mensaje =
            e.error?.mensaje ??
            (Array.isArray(e.error?.message)
              ? e.error?.message.join(", ")
              : (e.error?.message as string)) ??
            "No se pudo actualizar el paquete";
          this.toast.error(mensaje);
        },
      });
  }
}
