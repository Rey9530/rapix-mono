import { Routes } from '@angular/router';

export const task: Routes = [
  {
    path: '',
    loadComponent: () => import('./task').then((m) => m.Task),
    data: {
      title: 'Tasks',
      breadcrumb: 'Tasks',
    },
  },
];
