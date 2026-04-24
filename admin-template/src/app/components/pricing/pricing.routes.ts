import { Routes } from '@angular/router';

export const pricing: Routes = [
  {
    path: '',
    loadComponent: () => import('./pricing').then((m) => m.Pricing),
    data: {
      breadcrumb: 'Pricing',
    },
  },
];
