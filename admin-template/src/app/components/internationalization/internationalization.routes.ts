import { Routes } from '@angular/router';

export const internationalization: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./internationalization').then((m) => m.Internationalization),
    data: {
      title: 'Internationalization',
      breadcrumb: 'Internationalization',
    },
  },
];
