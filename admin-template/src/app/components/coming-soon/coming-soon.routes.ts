import { Routes } from '@angular/router';

export const comingSoon: Routes = [
  {
    path: 'coming-soon',
    loadComponent: () =>
      import('./coming-soon/coming-soon').then((m) => m.ComingSoon),
  },
  {
    path: 'coming-soon-video',
    loadComponent: () =>
      import('./coming-soon-video/coming-soon-video').then(
        (m) => m.ComingSoonVideo,
      ),
  },
  {
    path: 'coming-soon-image',
    loadComponent: () =>
      import('./coming-soon-image/coming-soon-image').then(
        (m) => m.ComingSoonImage,
      ),
  },
];
