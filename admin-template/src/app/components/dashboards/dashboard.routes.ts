import { Routes } from '@angular/router';

export const dashboard: Routes = [
  {
    path: 'default',
    loadComponent: () => import('./default/default').then((m) => m.Default),
    data: {
      pageTitle: 'Default Dashboard',
      title: 'Default',
      breadcrumb: 'Default',
    },
  },
  {
    path: 'e-commerce',
    loadComponent: () =>
      import('./ecommerce/ecommerce').then((m) => m.Ecommerce),
    data: {
      pageTitle: 'E-Commerce Dashboard',
      title: 'E-Commerce',
      breadcrumb: 'E-Commerce',
    },
  },
  {
    path: 'online-course',
    loadComponent: () =>
      import('./online-course/online-course').then((m) => m.OnlineCourse),
    data: {
      pageTitle: 'Online course Dashboard',
      title: 'Online course',
      breadcrumb: 'Online course',
    },
  },
  {
    path: 'crypto',
    loadComponent: () => import('./crypto/crypto').then((m) => m.Crypto),
    data: {
      pageTitle: 'Crypto Dashboard',
      title: 'Crypto',
      breadcrumb: 'Crypto',
    },
  },
  {
    path: 'social',
    loadComponent: () => import('./social/social').then((m) => m.Social),
    data: {
      pageTitle: 'Social Dashboard',
      title: 'Social',
      breadcrumb: 'Social',
    },
  },
  {
    path: 'nft',
    loadComponent: () => import('./nft/nft').then((m) => m.Nft),
    data: {
      pageTitle: 'NFT Dashboard',
      title: 'NFT',
      breadcrumb: 'NFT',
    },
  },
  {
    path: 'school-management',
    loadComponent: () =>
      import('./school-management/school-management').then(
        (m) => m.SchoolManagement,
      ),
    data: {
      pageTitle: 'School management Dashboard',
      title: 'School management',
      breadcrumb: 'School manage',
    },
  },
  {
    path: 'pos',
    loadComponent: () => import('./pos/pos').then((m) => m.Pos),
    data: {
      pageTitle: 'POS Dashboard',
      title: 'POS',
      breadcrumb: 'POS',
    },
  },
  {
    path: 'crm',
    loadComponent: () => import('./crm/crm').then((m) => m.Crm),
    data: {
      pageTitle: 'CRM Dashboard',
      title: 'CRM',
      breadcrumb: 'CRM',
    },
  },
  {
    path: 'analytics',
    loadComponent: () =>
      import('./analytics/analytics').then((m) => m.Analytics),
    data: {
      pageTitle: 'Analytics Dashboard',
      title: 'Analytics',
      breadcrumb: 'Analytics',
    },
  },
  {
    path: 'hr',
    loadComponent: () => import('./hr/hr').then((m) => m.Hr),
    data: {
      pageTitle: 'HR Dashboard',
      title: 'HR Dashboard',
      breadcrumb: 'HR Dashboard',
    },
  },
  {
    path: 'projects',
    loadComponent: () => import('./projects/projects').then((m) => m.Projects),
    data: {
      pageTitle: 'Projects Dashboard',
      title: 'Projects Dashboard',
      breadcrumb: 'Projects Dashboard',
    },
  },
  {
    path: 'logistics',
    loadComponent: () =>
      import('./logistics/logistics').then((m) => m.Logistics),
    data: {
      pageTitle: 'Logistics Dashboard',
      title: 'Logistics Dashboard',
      breadcrumb: 'Logistics Dashboard',
    },
  },
];
