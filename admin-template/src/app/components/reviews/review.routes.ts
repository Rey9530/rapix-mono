import { Routes } from '@angular/router';

export const review: Routes = [
  {
    path: '',
    loadComponent: () => import('./reviews').then((m) => m.Reviews),
    data: {
      title: 'Manage Review',
      breadcrumb: 'Manage Review',
    },
  },
];
