import { Routes } from '@angular/router';

export const formWidgets: Routes = [
  {
    path: 'datepicker',
    loadComponent: () =>
      import('./datepicker/datepicker').then((m) => m.Datepicker),
    data: {
      title: 'Datepicker',
      breadcrumb: 'Datepicker',
    },
  },
  {
    path: 'touchspin',
    loadComponent: () =>
      import('./touchspin/touchspin').then((m) => m.Touchspin),
    data: {
      title: 'Touchspin',
      breadcrumb: 'Touchspin',
    },
  },
  {
    path: 'select2',
    loadComponent: () => import('./select2/select2').then((m) => m.Select2),
    data: {
      title: 'Select2',
      breadcrumb: 'Select2',
    },
  },
  {
    path: 'switch',
    loadComponent: () => import('./switch/switch').then((m) => m.Switch),
    data: {
      title: 'Switch',
      breadcrumb: 'Switch',
    },
  },
  {
    path: 'type-ahead',
    loadComponent: () =>
      import('./typeahead/typeahead').then((m) => m.Typeahead),
    data: {
      title: 'Typeahead',
      breadcrumb: 'Typeahead',
    },
  },
  {
    path: 'clipboard',
    loadComponent: () =>
      import('./clipboard/clipboard').then((m) => m.Clipboard),
    data: {
      title: 'Clipboard',
      breadcrumb: 'Clipboard',
    },
  },
];
