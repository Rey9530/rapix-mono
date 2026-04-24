import { Routes } from '@angular/router';

export const calendar: Routes = [
  {
    path: '',
    loadComponent: () => import('./calendar').then((m) => m.Calendar),
    data: {
      title: 'Calender',
      breadcrumb: 'Calender',
    },
  },
];
