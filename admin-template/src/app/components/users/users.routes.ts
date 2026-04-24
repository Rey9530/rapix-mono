import { Routes } from '@angular/router';

export const users: Routes = [
  {
    path: 'user-profile/:id',
    loadComponent: () =>
      import('./user-profile/user-profile').then((m) => m.UserProfile),
    data: {
      title: 'User Profile',
      breadcrumb: 'User Profile',
    },
  },
  {
    path: 'add-user',
    loadComponent: () => import('./add-user/add-user').then((m) => m.AddUser),
    data: {
      title: 'Add User',
      breadcrumb: 'Add User',
    },
  },
  {
    path: 'user-list',
    loadComponent: () =>
      import('./user-list/user-list').then((m) => m.UserList),
    data: {
      title: 'User List',
      breadcrumb: 'User List',
    },
  },
  {
    path: 'user-cards',
    loadComponent: () =>
      import('./user-cards/user-cards').then((m) => m.UserCards),
    data: {
      title: 'User Cards',
      breadcrumb: 'User Cards',
    },
  },
  {
    path: 'roles-permission',
    loadComponent: () =>
      import('./roles-permission/roles-permission').then(
        (m) => m.RolesPermission,
      ),
    data: {
      title: 'Roles & Permission',
      breadcrumb: 'Roles & Permission',
    },
  },
];
