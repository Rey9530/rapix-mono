import { Routes } from '@angular/router';

export const cart: Routes = [
  {
    path: '',
    loadComponent: () => import('./cart').then((m) => m.Cart),
    data: {
      title: 'Cart',
      breadcrumb: 'Cart',
    },
  },
];
