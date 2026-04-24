import { Routes } from '@angular/router';

export const bookmark: Routes = [
  {
    path: '',
    loadComponent: () => import('./bookmark').then((m) => m.Bookmark),
    data: {
      title: 'Bookmark',
      breadcrumb: 'Bookmark',
    },
  },
];
