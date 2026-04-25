import { HttpClient } from "@angular/common/http";
import { Injectable, computed, inject, signal } from "@angular/core";

import { Observable, tap } from "rxjs";

import { environment } from "../../../environments/environment";
import { RespuestaSesion, Usuario } from "../modelos/usuario.modelo";

const CLAVE_TOKEN_ACCESO = "delivery.tokenAcceso";
const CLAVE_TOKEN_REFRESCO = "delivery.tokenRefresco";
const CLAVE_USUARIO = "delivery.usuario";

@Injectable({ providedIn: "root" })
export class AutenticacionServicio {
  private readonly http = inject(HttpClient);
  private readonly base = environment.urlApi;

  // Signal con el usuario actual; null cuando no hay sesión.
  private readonly _usuarioActual = signal<Usuario | null>(
    this.cargarUsuarioPersistido(),
  );
  readonly usuarioActual = this._usuarioActual.asReadonly();
  readonly esAdmin = computed(() => this._usuarioActual()?.rol === "ADMIN");
  readonly autenticado = computed(() => this._usuarioActual() !== null);

  iniciarSesion(
    email: string,
    contrasena: string,
  ): Observable<RespuestaSesion> {
    return this.http
      .post<RespuestaSesion>(`${this.base}/autenticacion/iniciar-sesion`, {
        email,
        contrasena,
      })
      .pipe(tap((respuesta) => this.guardarSesion(respuesta)));
  }

  cerrarSesion(): void {
    const refresco = this.tokenRefresco;
    // Best-effort: se intenta invalidar en backend pero no se bloquea el logout.
    if (refresco) {
      this.http
        .post(`${this.base}/autenticacion/cerrar-sesion`, {
          tokenRefresco: refresco,
        })
        .subscribe({ error: () => {} });
    }
    this.limpiarSesion();
  }

  refrescar(): Observable<RespuestaSesion> {
    return this.http
      .post<RespuestaSesion>(`${this.base}/autenticacion/refrescar`, {
        tokenRefresco: this.tokenRefresco,
      })
      .pipe(tap((respuesta) => this.guardarSesion(respuesta)));
  }

  get tokenAcceso(): string | null {
    return localStorage.getItem(CLAVE_TOKEN_ACCESO);
  }

  get tokenRefresco(): string | null {
    return localStorage.getItem(CLAVE_TOKEN_REFRESCO);
  }

  private guardarSesion(respuesta: RespuestaSesion): void {
    localStorage.setItem(CLAVE_TOKEN_ACCESO, respuesta.tokenAcceso);
    localStorage.setItem(CLAVE_TOKEN_REFRESCO, respuesta.tokenRefresco);
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(respuesta.usuario));
    this._usuarioActual.set(respuesta.usuario);
  }

  private limpiarSesion(): void {
    localStorage.removeItem(CLAVE_TOKEN_ACCESO);
    localStorage.removeItem(CLAVE_TOKEN_REFRESCO);
    localStorage.removeItem(CLAVE_USUARIO);
    this._usuarioActual.set(null);
  }

  private cargarUsuarioPersistido(): Usuario | null {
    const raw = localStorage.getItem(CLAVE_USUARIO);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Usuario;
    } catch {
      localStorage.removeItem(CLAVE_USUARIO);
      return null;
    }
  }
}
