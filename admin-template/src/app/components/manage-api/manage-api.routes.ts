import { Routes } from '@angular/router';

export const manageAPI: Routes = [
  {
    path: '',
    loadComponent: () => import('./manage-api').then((m) => m.ManageApi),
    data: {
      title: 'Manage API',
      breadcrumb: 'Manage API',
    },
  },
];
