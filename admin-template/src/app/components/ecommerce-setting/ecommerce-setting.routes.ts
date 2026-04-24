import { Routes } from '@angular/router';

export const setting: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./ecommerce-setting').then((m) => m.EcommerceSetting),
    data: {
      title: 'Settings',
      breadcrumb: 'Settings',
    },
  },
];
