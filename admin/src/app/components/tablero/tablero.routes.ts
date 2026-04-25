import { Routes } from "@angular/router";

export const tableroRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("./tablero").then((m) => m.Tablero),
    data: { title: "Tablero", breadcrumb: "Tablero" },
  },
];
