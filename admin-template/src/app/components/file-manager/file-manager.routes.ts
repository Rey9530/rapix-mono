import { Routes } from '@angular/router';

export const filManager: Routes = [
  {
    path: '',
    loadComponent: () => import('./file-manager').then((m) => m.FileManager),
    data: {
      title: 'File Manager',
      breadcrumb: 'File Manager',
    },
  },
];
