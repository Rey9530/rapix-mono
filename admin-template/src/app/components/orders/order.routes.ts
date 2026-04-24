import { Routes } from '@angular/router';

export const order: Routes = [
  {
    path: 'list',
    loadComponent: () => import('./orders').then((m) => m.Orders),
    data: {
      title: 'Order History',
      breadcrumb: 'Order History',
    },
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./order-details/order-details').then((m) => m.OrderDetails),
    data: {
      title: 'Order Details',
      breadcrumb: 'Order Details',
    },
  },
];
