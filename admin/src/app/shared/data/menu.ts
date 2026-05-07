import { BehaviorSubject } from "rxjs";

import { IMenu } from "../interface/menu";

export const menuItems: IMenu[] = [
  {
    main_title: "Operación",
  },
  {
    title: "Tablero",
    icon: "home",
    type: "link",
    path: "/tablero",
    level: 1,
  },
  {
    title: "Pedidos",
    icon: "support-tickets",
    type: "link",
    path: "/pedidos",
    level: 1,
  },
  {
    title: "Cierres financieros",
    icon: "task",
    type: "link",
    path: "/cierres",
    level: 1,
  },
  {
    title: "WhatsApp",
    icon: "chat",
    type: "link",
    path: "/whatsapp",
    level: 1,
  },
  {
    main_title: "Administración",
  },
  {
    title: "Usuarios",
    icon: "user",
    type: "link",
    path: "/usuarios",
    level: 1,
  },
  {
    title: "Zonas",
    icon: "maps",
    type: "link",
    path: "/zonas",
    level: 1,
  },
  {
    title: "Paquetes de envíos",
    icon: "price",
    type: "link",
    path: "/reglas-tarifa",
    level: 1,
  },
];

// Array
export const items = new BehaviorSubject<IMenu[]>(menuItems);
