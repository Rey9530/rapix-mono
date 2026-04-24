import { Routes } from '@angular/router';

export const mail: Routes = [
  {
    path: '',
    loadComponent: () => import('./mail-box').then((m) => m.MailBox),
    data: {
      title: 'Mail Box',
      breadcrumb: 'Mail Box',
    },
  },
];
