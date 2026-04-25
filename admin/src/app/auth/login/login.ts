import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, inject } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";

import { ToastrService } from "ngx-toastr";

import { AutenticacionServicio } from "../../nucleo/autenticacion/autenticacion.servicio";

@Component({
  selector: "app-login",
  imports: [RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./login.html",
  styleUrl: "./login.scss",
})
export class Login implements OnInit {
  private readonly auth = inject(AutenticacionServicio);
  private readonly router = inject(Router);
  private readonly ruta = inject(ActivatedRoute);
  private readonly toast = inject(ToastrService);

  public show = false;
  public enviando = false;
  public loginForm: FormGroup;

  constructor() {
    this.loginForm = new FormGroup({
      email: new FormControl("admin@delivery.com", [
        Validators.required,
        Validators.email,
      ]),
      contrasena: new FormControl("Admin123!", [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  ngOnInit(): void {
    if (this.auth.autenticado() && this.auth.esAdmin()) {
      this.router.navigate(["/tablero"]);
      return;
    }
    const mensaje = this.ruta.snapshot.queryParamMap.get("mensaje");
    if (mensaje === "rol-no-autorizado") {
      this.toast.error("Tu usuario no tiene rol ADMIN.");
    }
  }

  showPassword(): void {
    this.show = !this.show;
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.enviando = true;
    const { email, contrasena } = this.loginForm.value;

    this.auth.iniciarSesion(email, contrasena).subscribe({
      next: (sesion) => {
        this.enviando = false;
        if (sesion.usuario.rol !== "ADMIN") {
          this.auth.cerrarSesion();
          this.toast.error("Tu usuario no tiene rol ADMIN.");
          return;
        }
        this.toast.success(`Bienvenido, ${sesion.usuario.nombreCompleto}`);
        this.router.navigate(["/tablero"]);
      },
      error: (err: HttpErrorResponse) => {
        this.enviando = false;
        const mensaje =
          (err.error as { mensaje?: string; message?: string })?.mensaje ??
          (err.error as { mensaje?: string; message?: string })?.message ??
          (err.status === 401
            ? "Credenciales inválidas"
            : "No se pudo iniciar sesión");
        this.toast.error(mensaje);
      },
    });
  }
}
