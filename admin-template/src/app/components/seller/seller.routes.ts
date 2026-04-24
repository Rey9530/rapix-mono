import { Routes } from '@angular/router';

export const seller: Routes = [
  {
    path: 'list',
    loadComponent: () => import('./seller').then((m) => m.Seller),
    data: {
      title: 'Seller List',
      breadcrumb: 'Seller List',
    },
  },
  {
    path: ':id',
    loadComponent: () => import('./details/details').then((m) => m.Details),
    data: {
      title: 'Seller Details',
      breadcrumb: 'Seller Details',
    },
  },
];
