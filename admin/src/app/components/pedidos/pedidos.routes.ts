import { Routes } from "@angular/router";

export const pedidosRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("./pedidos").then((m) => m.Pedidos),
    data: { title: "Pedidos", breadcrumb: "Pedidos" },
  },
  {
    path: ":id",
    loadComponent: () =>
      import("./detalle-pedido/detalle-pedido").then((m) => m.DetallePedido),
    data: { title: "Detalle del pedido", breadcrumb: "Detalle" },
  },
];
