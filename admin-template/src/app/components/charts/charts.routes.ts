import { Routes } from '@angular/router';

export const charts: Routes = [
  {
    path: 'apex-chart',
    loadComponent: () =>
      import('./apex-chart/apex-chart').then((m) => m.ApexChart),
    data: {
      title: 'Apex Chart',
      breadcrumb: 'Apex Chart',
    },
  },
  {
    path: 'google-chart',
    loadComponent: () =>
      import('./google-chart/google-chart').then((m) => m.GoogleChart),
    data: {
      title: 'Google Chart',
      breadcrumb: 'Google Chart',
    },
  },
  {
    path: 'chatjs',
    loadComponent: () =>
      import('./chatjs-chart/chatjs-chart').then((m) => m.ChatjsChart),
    data: {
      title: 'Chatjs Chart',
      breadcrumb: 'Chatjs Chart',
    },
  },
  {
    path: 'chartist',
    loadComponent: () =>
      import('./chartist-chart/chartist-chart').then((m) => m.ChartistChart),
    data: {
      title: 'Chartist Chart',
      breadcrumb: 'Chartist Chart',
    },
  },
];
