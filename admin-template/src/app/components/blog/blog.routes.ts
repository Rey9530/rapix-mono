import { Routes } from '@angular/router';

export const blog: Routes = [
  {
    path: 'blog',
    loadComponent: () => import('./blog/blog').then((m) => m.Blog),
    data: {
      title: 'Blog',
      breadcrumb: 'Blog',
    },
  },
  {
    path: 'blog-details',
    loadComponent: () =>
      import('./blog-details/blog-details').then((m) => m.BlogDetails),
    data: {
      title: 'Blog Details',
      breadcrumb: 'Blog Details',
    },
  },
  {
    path: 'add-blog',
    loadComponent: () => import('./add-blog/add-blog').then((m) => m.AddBlog),
    data: {
      title: 'Add Blog',
      breadcrumb: 'Add Blog',
    },
  },
];
