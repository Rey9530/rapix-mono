import { Routes } from '@angular/router';

export const reports: Routes = [
  {
    path: 'products',
    loadComponent: () =>
      import('./product-report/product-report').then((m) => m.ProductReport),
    data: {
      title: 'Products',
      breadcrumb: 'Products',
    },
  },
  {
    path: 'sales',
    loadComponent: () =>
      import('./sales-report/sales-report').then((m) => m.SalesReport),
    data: {
      title: 'Sales',
      breadcrumb: 'Sales',
    },
  },
  {
    path: 'sales-return',
    loadComponent: () =>
      import('./sales-return-report/sales-return-report').then(
        (m) => m.SalesReturnReport,
      ),
    data: {
      title: 'Sales Return',
      breadcrumb: 'Sales Return',
    },
  },
  {
    path: 'customer-order',
    loadComponent: () =>
      import('./customer-order-report/customer-order-report').then(
        (m) => m.CustomerOrderReport,
      ),
    data: {
      title: 'Customer Order',
      breadcrumb: 'Customer Order',
    },
  },
];
