import { Routes } from '@angular/router';

export const faq: Routes = [
  {
    path: '',
    loadComponent: () => import('./faq').then((m) => m.Faq),
    data: {
      breadcrumb: 'FAQ',
    },
  },
];
