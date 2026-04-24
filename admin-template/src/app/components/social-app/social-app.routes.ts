import { Routes } from '@angular/router';

export const socialApp: Routes = [
  {
    path: '',
    loadComponent: () => import('./social-app').then((m) => m.SocialApp),
    data: {
      title: 'Social App',
      breadcrumb: 'Social App',
    },
  },
];
