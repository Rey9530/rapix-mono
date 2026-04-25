import { Routes } from "@angular/router";

export const content: Routes = [
  {
    path: "tablero",
    data: { title: "Tablero", breadcrumb: "Tablero" },
    loadChildren: () =>
      import("../../components/tablero/tablero.routes").then(
        (r) => r.tableroRoutes,
      ),
  },
  {
    path: "usuarios",
    data: { title: "Usuarios", breadcrumb: "Usuarios" },
    loadChildren: () =>
      import("../../components/usuarios/usuarios.routes").then(
        (r) => r.usuariosRoutes,
      ),
  },
  {
    path: "pedidos",
    data: { title: "Pedidos", breadcrumb: "Pedidos" },
    loadChildren: () =>
      import("../../components/pedidos/pedidos.routes").then(
        (r) => r.pedidosRoutes,
      ),
  },
  {
    path: "cierres",
    data: { title: "Cierres financieros", breadcrumb: "Cierres" },
    loadChildren: () =>
      import("../../components/cierres/cierres.routes").then(
        (r) => r.cierresRoutes,
      ),
  },
  // Sample pages legacy — se mantienen mientras se migran las features.
  {
    path: "pages",
    data: { title: "sample-page", breadcrumb: "sample-page" },
    loadChildren: () =>
      import("../../components/pages/pages.routes").then((r) => r.pages),
  },
];
