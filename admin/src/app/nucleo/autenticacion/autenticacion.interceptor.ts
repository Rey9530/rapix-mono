import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";

import { AutenticacionServicio } from "./autenticacion.servicio";

const RUTAS_PUBLICAS = [
  "/autenticacion/iniciar-sesion",
  "/autenticacion/refrescar",
  "/autenticacion/registrar",
];

/**
 * Añade `Authorization: Bearer <tokenAcceso>` a toda petición que
 * vaya al backend, salvo las rutas explícitamente públicas.
 */
export const autenticacionInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AutenticacionServicio);
  const token = auth.tokenAcceso;

  if (!token || RUTAS_PUBLICAS.some((ruta) => req.url.includes(ruta))) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
