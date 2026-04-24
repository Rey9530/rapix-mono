import { Routes } from '@angular/router';

export const jobSearch: Routes = [
  {
    path: 'cards-view',
    loadComponent: () =>
      import('./card-view/card-view').then((m) => m.CardView),
    data: {
      title: 'Cards View',
      breadcrumb: 'Cards View',
    },
  },
  {
    path: 'list-view',
    loadComponent: () =>
      import('./list-view/list-view').then((m) => m.ListView),
    data: {
      title: 'List View',
      breadcrumb: 'List View',
    },
  },
  {
    path: 'job-details',
    loadComponent: () =>
      import('./job-details/job-details').then((m) => m.JobDetails),
    data: {
      title: 'Job Details',
      breadcrumb: 'Job Details',
    },
  },
  {
    path: 'candidates',
    loadComponent: () =>
      import('./candidates/candidates').then((m) => m.Candidates),
    data: {
      title: 'Candidates',
      breadcrumb: 'Candidates',
    },
  },
  {
    path: 'companies',
    loadComponent: () =>
      import('./companies/companies').then((m) => m.Companies),
    data: {
      title: 'Companies',
      breadcrumb: 'Companies',
    },
  },
  {
    path: 'apply',
    loadComponent: () => import('./apply/apply').then((m) => m.Apply),
    data: {
      title: 'Apply',
      breadcrumb: 'Apply',
    },
  },
];
