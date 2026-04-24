import { Routes } from '@angular/router';

export const animation: Routes = [
  {
    path: 'animate',
    loadComponent: () => import('./animate/animate').then((m) => m.Animate),
    data: {
      title: 'Animate',
      breadcrumb: 'Animate',
    },
  },
];
