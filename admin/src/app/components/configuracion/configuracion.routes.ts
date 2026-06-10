import { Routes } from "@angular/router";

export const configuracionRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("./configuracion").then((m) => m.Configuracion),
    data: { title: "Configuración", breadcrumb: "Configuración" },
  },
];
