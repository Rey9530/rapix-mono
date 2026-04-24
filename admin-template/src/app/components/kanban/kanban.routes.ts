import { Routes } from '@angular/router';

export const kanban: Routes = [
  {
    path: '',
    loadComponent: () => import('./kanban').then((m) => m.Kanban),
    data: {
      pageTitle: 'Kanban Board',
      title: 'Kanban',
      breadcrumb: 'Kanban',
    },
  },
];
