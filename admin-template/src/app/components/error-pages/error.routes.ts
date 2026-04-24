import { Routes } from '@angular/router';

export const error: Routes = [
  {
    path: '403',
    loadComponent: () =>
      import('./error-403/error-403').then((m) => m.Error403),
  },
  {
    path: '404',
    loadComponent: () =>
      import('./error-404/error-404').then((m) => m.Error404),
  },
  {
    path: '500',
    loadComponent: () =>
      import('./error-500/error-500').then((m) => m.Error500),
  },
];
