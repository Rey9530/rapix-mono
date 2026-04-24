import { Routes } from '@angular/router';

export const siteMap: Routes = [
  {
    path: '',
    loadComponent: () => import('./sitemap').then((m) => m.Sitemap),
    data: {
      title: 'Sitemap',
      breadcrumb: 'Sitemap',
    },
  },
];
