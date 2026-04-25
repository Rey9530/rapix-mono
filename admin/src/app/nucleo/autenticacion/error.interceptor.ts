import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";

import { catchError, switchMap, throwError } from "rxjs";

import { AutenticacionServicio } from "./autenticacion.servicio";

/**
 * En 401 intenta refrescar el token una vez. Si el refresh falla,
 * limpia la sesión y redirige a /iniciar-sesion. Si el 401 viene
 * del propio endpoint de refresh, no reintenta para evitar loop.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AutenticacionServicio);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !req.url.includes("/autenticacion/iniciar-sesion") &&
        !req.url.includes("/autenticacion/refrescar") &&
        auth.tokenRefresco
      ) {
        return auth.refrescar().pipe(
          switchMap(() => {
            const nuevoToken = auth.tokenAcceso;
            const reintento = req.clone({
              setHeaders: nuevoToken
                ? { Authorization: `Bearer ${nuevoToken}` }
                : {},
            });
            return next(reintento);
          }),
          catchError((errorRefresh) => {
            auth.cerrarSesion();
            router.navigate(["/iniciar-sesion"]);
            return throwError(() => errorRefresh);
          }),
        );
      }
      return throwError(() => error);
    }),
  );
};
