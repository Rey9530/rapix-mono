import { Routes } from '@angular/router';

export const courses: Routes = [
  {
    path: 'courses-list',
    loadComponent: () =>
      import('./course-list/course-list').then((m) => m.CourseList),
    data: {
      title: 'Course List',
      breadcrumb: 'Course List',
    },
  },
  {
    path: 'courses-details',
    loadComponent: () =>
      import('./course-details/course-details').then((m) => m.CourseDetails),
    data: {
      title: 'Course Details',
      breadcrumb: 'Course Details',
    },
  },
];
