import { Routes } from '@angular/router';

export const category: Routes = [
  {
    path: '',
    loadComponent: () => import('./category').then((m) => m.Category),
    data: {
      title: 'Category',
      breadcrumb: 'Category',
    },
  },
];
