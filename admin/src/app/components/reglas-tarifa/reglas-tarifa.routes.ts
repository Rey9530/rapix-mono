import { Routes } from "@angular/router";

export const reglasTarifaRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./reglas-tarifa").then((m) => m.ReglasTarifa),
    data: { title: "Paquetes de envíos", breadcrumb: "Paquetes de envíos" },
  },
];
