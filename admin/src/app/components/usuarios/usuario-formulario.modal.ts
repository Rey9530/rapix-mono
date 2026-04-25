import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";

import {
  CrearUsuarioPayload,
  UsuariosServicio,
} from "../../nucleo/datos/usuarios.servicio";
import { Zona, ZonasServicio } from "../../nucleo/datos/zonas.servicio";
import { RolUsuario, Usuario } from "../../nucleo/modelos/usuario.modelo";

@Component({
  selector: "app-usuario-formulario-modal",
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./usuario-formulario.modal.html",
})
export class UsuarioFormularioModal implements OnInit {
  @Input() usuario: Usuario | null = null;

  readonly modal = inject(NgbActiveModal);
  private readonly fb = inject(FormBuilder);
  private readonly servicio = inject(UsuariosServicio);
  private readonly zonasServicio = inject(ZonasServicio);
  private readonly toast = inject(ToastrService);

  readonly roles: RolUsuario[] = ["ADMIN", "VENDEDOR", "REPARTIDOR"];
  zonas: Zona[] = [];
  enviando = false;

  // FormGroup amplio: campos opcionales se validan condicionalmente.
  readonly form = this.fb.nonNullable.group({
    email: ["", [Validators.required, Validators.email]],
    telefono: ["", [Validators.required]],
    nombreCompleto: ["", [Validators.required]],
    contrasena: [""],
    rol: ["VENDEDOR" as RolUsuario, [Validators.required]],
    // Vendedor
    nombreNegocio: [""],
    direccion: [""],
    latitud: [0],
    longitud: [0],
    // Repartidor
    tipoVehiculo: [""],
    documentoIdentidad: [""],
    placa: [""],
    zonaIds: [[] as string[]],
    zonaPrimariaId: [""],
  });

  get esEdicion(): boolean {
    return this.usuario !== null;
  }

  ngOnInit(): void {
    this.zonasServicio.listar().subscribe({
      next: (zs) => (this.zonas = zs),
      error: () => (this.zonas = []),
    });

    if (this.usuario) {
      this.form.patchValue({
        email: this.usuario.email,
        telefono: this.usuario.telefono,
        nombreCompleto: this.usuario.nombreCompleto,
        rol: this.usuario.rol === "CLIENTE" ? "VENDEDOR" : this.usuario.rol,
      });
      this.form.controls.email.disable();
      this.form.controls.rol.disable();
    } else {
      // Contraseña requerida solo en creación.
      this.form.controls.contrasena.addValidators([
        Validators.required,
        Validators.minLength(8),
      ]);
    }

    this.form.controls.rol.valueChanges.subscribe(() =>
      this.actualizarValidacionesPorRol(),
    );
    this.actualizarValidacionesPorRol();
  }

  private actualizarValidacionesPorRol(): void {
    const rol = this.form.controls.rol.value;
    const c = this.form.controls;

    [
      c.nombreNegocio,
      c.direccion,
      c.latitud,
      c.longitud,
      c.tipoVehiculo,
      c.documentoIdentidad,
    ].forEach((ctrl) => ctrl.clearValidators());

    if (rol === "VENDEDOR" && !this.esEdicion) {
      c.nombreNegocio.addValidators(Validators.required);
      c.direccion.addValidators(Validators.required);
      c.latitud.addValidators(Validators.required);
      c.longitud.addValidators(Validators.required);
    } else if (rol === "REPARTIDOR" && !this.esEdicion) {
      c.tipoVehiculo.addValidators(Validators.required);
      c.documentoIdentidad.addValidators(Validators.required);
    }
    Object.values(c).forEach((ctrl) =>
      ctrl.updateValueAndValidity({ emitEvent: false }),
    );
  }

  toggleZona(zonaId: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const actuales = this.form.controls.zonaIds.value;
    if (checked) {
      this.form.controls.zonaIds.setValue([...actuales, zonaId]);
    } else {
      this.form.controls.zonaIds.setValue(
        actuales.filter((id) => id !== zonaId),
      );
      if (this.form.controls.zonaPrimariaId.value === zonaId) {
        this.form.controls.zonaPrimariaId.setValue("");
      }
    }
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando = true;
    const valor = this.form.getRawValue();

    if (this.esEdicion && this.usuario) {
      this.servicio
        .actualizar(this.usuario.id, {
          telefono: valor.telefono,
          nombreCompleto: valor.nombreCompleto,
        })
        .subscribe({
          next: () => {
            this.toast.success("Usuario actualizado");
            this.modal.close("actualizado");
          },
          error: (e) => this.fallar(e),
        });
      return;
    }

    const payload: CrearUsuarioPayload = {
      email: valor.email,
      telefono: valor.telefono,
      contrasena: valor.contrasena,
      nombreCompleto: valor.nombreCompleto,
      rol: valor.rol,
    };
    if (valor.rol === "VENDEDOR") {
      payload.nombreNegocio = valor.nombreNegocio;
      payload.direccion = valor.direccion;
      payload.latitud = Number(valor.latitud);
      payload.longitud = Number(valor.longitud);
    } else if (valor.rol === "REPARTIDOR") {
      payload.tipoVehiculo = valor.tipoVehiculo;
      payload.documentoIdentidad = valor.documentoIdentidad;
      payload.placa = valor.placa || undefined;
      if (valor.zonaIds.length > 0) {
        payload.zonaIds = valor.zonaIds;
        payload.zonaPrimariaId = valor.zonaPrimariaId || valor.zonaIds[0];
      }
    }

    this.servicio.crear(payload).subscribe({
      next: () => {
        this.toast.success("Usuario creado");
        this.modal.close("creado");
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
      "No se pudo guardar el usuario";
    this.toast.error(mensaje);
  }
}
