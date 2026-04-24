import { Routes } from '@angular/router';

export const icons: Routes = [
  {
    path: 'flag-icon',
    loadComponent: () =>
      import('./flag-icon/flag-icon').then((m) => m.FlagIcon),
    data: {
      title: 'Flag Icons',
      breadcrumb: 'Flag Icons',
    },
  },
  {
    path: 'font-awesome-icon',
    loadComponent: () =>
      import('./font-awesome-icon/font-awesome-icon').then(
        (m) => m.FontAwesomeIcon,
      ),
    data: {
      title: 'Fontawesome Icon',
      breadcrumb: 'Fontawesome Icon',
    },
  },
  {
    path: 'ico-icon',
    loadComponent: () => import('./ico-icon/ico-icon').then((m) => m.IcoIcon),
    data: {
      title: 'ICO Icon',
      breadcrumb: 'Ico Icon',
    },
  },
  {
    path: 'thimify-icon',
    loadComponent: () =>
      import('./themify-icon/themify-icon').then((m) => m.ThemifyIcon),
    data: {
      title: 'Themify Icon',
      breadcrumb: 'Themify Icon',
    },
  },
  {
    path: 'feather-icon',
    loadComponent: () =>
      import('./feather-icon/feather-icon').then((m) => m.FeatherIcons),
    data: {
      title: 'Feather Icons',
      breadcrumb: 'Feather Icon',
    },
  },
  {
    path: 'weather-icon',
    loadComponent: () =>
      import('./weather-icon/weather-icon').then((m) => m.WeatherIcon),
    data: {
      title: 'Weather Icon',
      breadcrumb: 'Weather Icon',
    },
  },
];
