import { Routes } from "@angular/router";

export const whatsappRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./whatsapp-pagina").then((m) => m.WhatsappPagina),
    data: { title: "WhatsApp", breadcrumb: "WhatsApp" },
  },
];
