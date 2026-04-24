import { Routes } from '@angular/router';

export const wishlist: Routes = [
  {
    path: '',
    loadComponent: () => import('./wishlist').then((m) => m.Wishlist),
    data: {
      title: 'Wishlist',
      breadcrumb: 'Wishlist',
    },
  },
];
