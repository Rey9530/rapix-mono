import { Routes } from '@angular/router';

export const invoice: Routes = [
  {
    path: 'invoice-1',
    loadComponent: () =>
      import('./invoice-1/invoice-1').then((m) => m.Invoice1),
  },
  {
    path: 'invoice-2',
    loadComponent: () =>
      import('./invoice-2/invoice-2').then((m) => m.Invoice2),
  },
  {
    path: 'invoice-3',
    loadComponent: () =>
      import('./invoice-3/invoice-3').then((m) => m.Invoice3),
  },
  {
    path: 'invoice-4',
    loadComponent: () =>
      import('./invoice-4/invoice-4').then((m) => m.Invoice4),
  },
  {
    path: 'invoice-5',
    loadComponent: () =>
      import('./invoice-5/invoice-5').then((m) => m.Invoice5),
  },
  {
    path: 'invoice-6',
    loadComponent: () =>
      import('./invoice-6/invoice-6').then((m) => m.Invoice6),
  },
];
