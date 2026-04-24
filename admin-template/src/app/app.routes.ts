import { Routes } from '@angular/router';

import { AdminGuard } from './shared/guard/admin.guard';
import { content } from './shared/routes/content.routes';
import { full } from './shared/routes/full.routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard/default',
    pathMatch: 'full',
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./auth/login/login').then((m) => m.Login),
  },
  {
    path: '',
    loadComponent: () =>
      import('./shared/components/layout/content/content').then(
        (m) => m.Content,
      ),
    canActivate: [AdminGuard],
    children: content,
  },
  {
    path: '',
    loadComponent: () =>
      import('./shared/components/layout/full/full').then((m) => m.Full),
    canActivate: [AdminGuard],
    children: full,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
