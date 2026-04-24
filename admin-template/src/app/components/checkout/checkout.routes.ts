import { Routes } from '@angular/router';

export const checkout: Routes = [
  {
    path: '',
    loadComponent: () => import('./checkout').then((m) => m.Checkout),
    data: {
      title: 'Checkout',
      breadcrumb: 'Checkout',
    },
  },
];
