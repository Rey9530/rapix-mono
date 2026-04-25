import { CommonModule } from "@angular/common";
import { Component, Input, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";

import { CierresServicio } from "../../nucleo/datos/cierres.servicio";

@Component({
  selector: "app-rechazar-cierre-modal",
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./rechazar-cierre.modal.html",
})
export class RechazarCierreModal {
  @Input() cierreId!: string;

  readonly modal = inject(NgbActiveModal);
  private readonly fb = inject(FormBuilder);
  private readonly servicio = inject(CierresServicio);
  private readonly toast = inject(ToastrService);

  enviando = false;

  readonly form = this.fb.nonNullable.group({
    motivo: ["", [Validators.required, Validators.minLength(5)]],
  });

  rechazar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando = true;
    this.servicio
      .rechazar(this.cierreId, this.form.controls.motivo.value)
      .subscribe({
        next: () => {
          this.toast.success("Cierre rechazado");
          this.modal.close("rechazado");
        },
        error: (e) => {
          this.enviando = false;
          this.toast.error(e?.error?.mensaje ?? "No se pudo rechazar");
        },
      });
  }
}
