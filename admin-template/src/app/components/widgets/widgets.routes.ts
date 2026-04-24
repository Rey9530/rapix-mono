import { Routes } from '@angular/router';

export const widgets: Routes = [
  {
    path: 'general',
    loadComponent: () => import('./general/general').then((m) => m.General),
    data: {
      pageTitle: 'General Widgets',
      title: 'General',
      breadcrumb: 'General',
    },
  },
  {
    path: 'charts',
    loadComponent: () => import('./charts/charts').then((m) => m.Charts),
    data: {
      title: 'Chart',
      breadcrumb: 'Chart',
    },
  },
];
