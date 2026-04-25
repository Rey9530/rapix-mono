import { Routes } from "@angular/router";

export const usuariosRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("./usuarios").then((m) => m.Usuarios),
    data: { title: "Usuarios", breadcrumb: "Usuarios" },
  },
];
