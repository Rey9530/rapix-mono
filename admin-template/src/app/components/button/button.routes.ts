import { Routes } from '@angular/router';

export const button: Routes = [
  {
    path: '',
    loadComponent: () => import('./button').then((m) => m.Button),
    data: {
      title: 'Buttons',
      breadcrumb: 'Buttons',
    },
  },
];
