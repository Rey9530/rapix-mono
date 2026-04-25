import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

import { AutenticacionServicio } from "./autenticacion.servicio";

/**
 * Bloquea acceso a rutas internas si el usuario no tiene sesión.
 * Adicionalmente exige rol ADMIN — el panel solo lo opera el rol ADMIN.
 */
export const autenticacionGuardia: CanActivateFn = () => {
  const auth = inject(AutenticacionServicio);
  const router = inject(Router);

  if (!auth.autenticado()) {
    return router.createUrlTree(["/iniciar-sesion"]);
  }
  if (!auth.esAdmin()) {
    return router.createUrlTree(["/iniciar-sesion"], {
      queryParams: { mensaje: "rol-no-autorizado" },
    });
  }
  return true;
};
