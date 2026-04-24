import { Routes } from '@angular/router';

export const authentication: Routes = [
  {
    path: 'login-simple',
    loadComponent: () => import('./login/login').then((m) => m.Login),
  },
  {
    path: 'login-bg-image',
    loadComponent: () =>
      import('./login-bg-image/login-bg-image').then((m) => m.LoginBgImage),
  },
  {
    path: 'login-bg-image-two',
    loadComponent: () =>
      import('./login-bg-image-two/login-bg-image-two').then(
        (m) => m.LoginBgImageTwo,
      ),
  },
  {
    path: 'login-bg-image-three',
    loadComponent: () =>
      import('./login-bg-image-three/login-bg-image-three').then(
        (m) => m.LoginBgImageThree,
      ),
  },
  {
    path: 'login-tooltip',
    loadComponent: () =>
      import('./login-bg-image-two/login-bg-image-two').then(
        (m) => m.LoginBgImageTwo,
      ),
  },
  {
    path: 'login-sweet-alert',
    loadComponent: () =>
      import('./login-sweet-alert/login-sweet-alert').then(
        (m) => m.LoginSweetAlert,
      ),
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register').then((m) => m.Register),
  },
  {
    path: 'register-bg-image',
    loadComponent: () =>
      import('./register-bg-image/register-bg-image').then(
        (m) => m.RegisterBgImage,
      ),
  },
  {
    path: 'register-bg-image-two',
    loadComponent: () =>
      import('./register-bg-image-two/register-bg-image-two').then(
        (m) => m.RegisterBgImageTwo,
      ),
  },
  {
    path: 'register-wizard',
    loadComponent: () =>
      import('./register-wizard/register-wizard').then((m) => m.RegisterWizard),
  },
  {
    path: 'account-restricted',
    loadComponent: () =>
      import('./account-restricted/account-restricted').then(
        (m) => m.AccountRestricted,
      ),
  },
  {
    path: 'unlock-user',
    loadComponent: () =>
      import('./unlock-user/unlock-user').then((m) => m.UnlockUser),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./forgot-password/forgot-password').then((m) => m.ForgotPassword),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./reset-password/reset-password').then((m) => m.ResetPassword),
  },
  {
    path: 'maintenance',
    loadComponent: () =>
      import('./maintenance/maintenance').then((m) => m.Maintenance),
  },
];
