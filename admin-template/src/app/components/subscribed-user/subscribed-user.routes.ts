import { Routes } from '@angular/router';

export const subscribedUser: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./subscribed-user').then((m) => m.SubscribedUser),
    data: {
      breadcrumb: 'Subscribed User',
    },
  },
];
