import { Routes } from '@angular/router';

export const editor: Routes = [
  {
    path: 'ngx-editors',
    loadComponent: () =>
      import('./ngx-editor/ngx-editor').then((m) => m.NgxEditor),
    data: {
      title: 'Ngx Editor',
      breadcrumb: 'Ngx Editor',
    },
  },
  {
    path: 'mde-editors',
    loadComponent: () =>
      import('./mde-editor/mde-editor').then((m) => m.MdeEditor),
    data: {
      title: 'MDE Editor',
      breadcrumb: 'MDE Editor',
    },
  },
];
