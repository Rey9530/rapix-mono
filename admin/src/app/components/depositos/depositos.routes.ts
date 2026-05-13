import { Routes } from "@angular/router";

export const depositosRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("./depositos").then((m) => m.Depositos),
    data: {
      title: "Depósitos a vendedores",
      breadcrumb: "Depósitos",
    },
  },
];
