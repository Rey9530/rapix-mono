import { Routes } from '@angular/router';

export const knowledgeBase: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./knowledge-base').then((m) => m.KnowledgeBase),
    data: {
      breadcrumb: 'Knowledgebase',
    },
  },
];
