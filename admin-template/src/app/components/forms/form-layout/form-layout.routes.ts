import { Routes } from '@angular/router';

export const formLayout: Routes = [
  {
    path: 'form-wizard',
    loadComponent: () =>
      import('./form-wizard1/form-wizard1').then((m) => m.FormWizard1),
    data: {
      title: ' Form Wizard 1',
      breadcrumb: ' Form Wizard 1',
    },
  },
  {
    path: 'form-wizard-two',
    loadComponent: () =>
      import('./form-wizard2/form-wizard2').then((m) => m.FormWizard2),
    data: {
      title: 'Form Wizard 2',
      breadcrumb: 'Form Wizard 2',
    },
  },
  {
    path: 'two-factor',
    loadComponent: () =>
      import('./two-factor/two-factor').then((m) => m.TwoFactor),
    data: {
      title: 'Two Factor',
      breadcrumb: 'Two Factor',
    },
  },
];
