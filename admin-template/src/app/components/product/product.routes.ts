import { Routes } from '@angular/router';

export const product: Routes = [
  {
    path: 'grid',
    loadComponent: () => import('./product').then((m) => m.Product),
    data: {
      title: 'Product',
      breadcrumb: 'Product',
    },
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./create-product/create-product').then((m) => m.CreateProduct),
    data: {
      title: 'Product',
      breadcrumb: 'Product',
    },
  },
  {
    path: 'list',
    loadComponent: () =>
      import('./product-list/product-list').then((m) => m.ProductList),
    data: {
      title: 'Product List',
      breadcrumb: 'Product List',
    },
  },
  {
    path: 'details',
    loadComponent: () =>
      import('./product-details/product-details').then((m) => m.ProductDetails),
    data: {
      title: 'Product Details',
      breadcrumb: 'Product Details',
    },
  },
];
