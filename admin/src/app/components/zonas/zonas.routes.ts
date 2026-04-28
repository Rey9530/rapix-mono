import { Routes } from "@angular/router";

export const zonasRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("./zonas").then((m) => m.Zonas),
    data: { title: "Zonas", breadcrumb: "Zonas" },
  },
];
