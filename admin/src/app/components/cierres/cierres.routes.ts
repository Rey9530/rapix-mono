import { Routes } from "@angular/router";

export const cierresRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("./cierres").then((m) => m.Cierres),
    data: { title: "Cierres financieros", breadcrumb: "Cierres" },
  },
];
