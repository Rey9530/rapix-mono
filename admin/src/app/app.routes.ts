import { Routes } from "@angular/router";

import { autenticacionGuardia } from "./nucleo/autenticacion/autenticacion.guardia";
import { content } from "./shared/routes/content.routes";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/tablero",
    pathMatch: "full",
  },
  {
    path: "iniciar-sesion",
    loadComponent: () => import("./auth/login/login").then((m) => m.Login),
  },
  {
    path: "",
    loadComponent: () =>
      import("./shared/components/layout/content/content").then(
        (m) => m.Content,
      ),
    canActivate: [autenticacionGuardia],
    children: content,
  },
  {
    path: "**",
    redirectTo: "",
  },
];
