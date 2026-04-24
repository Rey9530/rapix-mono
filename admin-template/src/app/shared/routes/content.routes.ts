import { Routes } from '@angular/router';

export const content: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('../../components/dashboards/dashboard.routes').then(
        (r) => r.dashboard,
      ),
    data: {
      title: 'Dashboard',
      breadcrumb: 'Dashboard',
    },
  },
  {
    path: 'widgets',
    loadChildren: () =>
      import('../../components/widgets/widgets.routes').then((r) => r.widgets),
    data: {
      title: 'Widgets',
      breadcrumb: 'Widgets',
    },
  },
  {
    path: 'product',
    loadChildren: () =>
      import('../../components/product/product.routes').then((r) => r.product),
    data: {
      title: 'Product',
      breadcrumb: 'Product',
    },
  },
  {
    path: 'seller',
    loadChildren: () =>
      import('../../components/seller/seller.routes').then((r) => r.seller),
    data: {
      title: 'Seller',
      breadcrumb: 'Ecommerce',
    },
  },
  {
    path: 'project',
    loadChildren: () =>
      import('../../components/projects/project.routes').then((r) => r.project),
    data: {
      title: 'Projects',
      breadcrumb: 'Projects',
    },
  },
  {
    path: 'kanban',
    loadChildren: () =>
      import('../../components/kanban/kanban.routes').then((r) => r.kanban),
    data: {
      title: 'Kanban',
      breadcrumb: 'Kanban',
    },
  },
  {
    path: 'gallery',
    data: {
      breadcrumb: 'Gallery',
    },
    loadChildren: () =>
      import('../../components/gallery/gallery.routes').then((r) => r.gallery),
  },
  {
    path: 'blog',
    data: {
      breadcrumb: 'Blog',
    },
    loadChildren: () =>
      import('../../components/blog/blog.routes').then((r) => r.blog),
  },
  {
    path: 'job-search',
    data: {
      breadcrumb: 'Jobs',
    },
    loadChildren: () =>
      import('../../components/jobs/jobs.routes').then((r) => r.jobSearch),
  },
  {
    path: 'courses',
    data: {
      breadcrumb: 'Course',
    },
    loadChildren: () =>
      import('../../components/courses/courses.routes').then((r) => r.courses),
  },
  {
    path: 'maps',
    data: {
      breadcrumb: 'Maps',
    },
    loadChildren: () =>
      import('../../components/maps/maps.routes').then((r) => r.maps),
  },
  {
    path: 'editors',
    data: {
      breadcrumb: 'Editors',
    },
    loadChildren: () =>
      import('../../components/editors/editor.routes').then((r) => r.editor),
  },
  {
    path: 'knowledgebase',
    data: {
      title: 'Knowledgebase',
      breadcrumb: 'Knowledgebase',
    },
    loadChildren: () =>
      import('../../components/knowledge-base/KnowledgeBase.routes').then(
        (r) => r.knowledgeBase,
      ),
  },
  {
    path: 'support-ticket',
    data: {
      title: 'Support Ticket',
      breadcrumb: 'Support Ticket',
    },
    loadChildren: () =>
      import('../../components/support-ticket/support-ticket.routes').then(
        (r) => r.supportTicket,
      ),
  },
  {
    path: 'subscribed-user',
    data: {
      title: 'Subscribed User',
      breadcrumb: 'Pages',
    },
    loadChildren: () =>
      import('../../components/subscribed-user/subscribed-user.routes').then(
        (r) => r.subscribedUser,
      ),
  },
  {
    path: 'faq',
    data: {
      title: 'FAQ',
      breadcrumb: 'Pages',
    },
    loadChildren: () =>
      import('../../components/faq/faq.routes').then((r) => r.faq),
  },
  {
    path: 'pricing',
    data: {
      title: 'Pricing',
      breadcrumb: 'Pages',
    },
    loadChildren: () =>
      import('../../components/pricing/pricing.routes').then((r) => r.pricing),
  },
  {
    path: 'forms/form-control',
    data: {
      breadcrumb: 'Form Controls',
    },
    loadChildren: () =>
      import('../../components/forms/form-controls/form-controls.routes').then(
        (r) => r.formControls,
      ),
  },
  {
    path: 'forms/form-widgets',
    data: {
      breadcrumb: 'Form Widgets',
    },
    loadChildren: () =>
      import('../../components/forms/form-widgets/form-widgets.routes').then(
        (r) => r.formWidgets,
      ),
  },
  {
    path: 'forms/form-layout',
    data: {
      breadcrumb: 'Form Layout',
    },
    loadChildren: () =>
      import('../../components/forms/form-layout/form-layout.routes').then(
        (r) => r.formLayout,
      ),
  },
  {
    path: 'table/bootstrap-tables',
    data: {
      breadcrumb: 'Bootstrap Tables',
    },
    loadChildren: () =>
      import('../../components/table/bootstrap-tables/bootstrap-table.routes').then(
        (r) => r.bootstrapTables,
      ),
  },
  {
    path: 'table/data-table',
    loadChildren: () =>
      import('../../components/table/data-table/data-table-routes').then(
        (r) => r.dataTable,
      ),
  },
  {
    path: 'charts',
    data: {
      breadcrumb: 'Charts',
    },
    loadChildren: () =>
      import('../../components/charts/charts.routes').then((r) => r.charts),
  },
  {
    path: 'file-manager',
    loadChildren: () =>
      import('../../components/file-manager/file-manager.routes').then(
        (r) => r.filManager,
      ),
  },
  {
    path: 'category',
    loadChildren: () =>
      import('../../components/category/category.routes').then(
        (r) => r.category,
      ),
  },
  {
    path: 'order',
    loadChildren: () =>
      import('../../components/orders/order.routes').then((r) => r.order),
  },
  {
    path: 'cart',
    loadChildren: () =>
      import('../../components/cart/cart.routes').then((r) => r.cart),
  },
  {
    path: 'wishlist',
    loadChildren: () =>
      import('../../components/wishlist/wishlist.routes').then(
        (r) => r.wishlist,
      ),
  },
  {
    path: 'checkout',
    loadChildren: () =>
      import('../../components/checkout/checkout.routes').then(
        (r) => r.checkout,
      ),
  },
  {
    path: 'review',
    loadChildren: () =>
      import('../../components/reviews/review.routes').then((r) => r.review),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('../../components/ecommerce-setting/ecommerce-setting.routes').then(
        (r) => r.setting,
      ),
  },
  {
    path: 'mail-box',
    loadChildren: () =>
      import('../../components/mail-box/mail-box.routes').then((r) => r.mail),
  },
  {
    path: 'chat',
    loadChildren: () =>
      import('../../components/chat/chat.routes').then((r) => r.chat),
    data: {
      title: 'Chat',
      breadcrumb: 'Chat',
    },
  },
  {
    path: 'user',
    loadChildren: () =>
      import('../../components/users/users.routes').then((r) => r.users),
    data: {
      title: 'User',
      breadcrumb: 'User',
    },
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('../../components/reports/reports.routes').then((r) => r.reports),
    data: {
      title: 'Reports',
      breadcrumb: 'Reports',
    },
  },
  {
    path: 'bookmark',
    loadChildren: () =>
      import('../../components/bookmark/bookmark.routes').then(
        (r) => r.bookmark,
      ),
  },
  {
    path: 'contacts',
    loadChildren: () =>
      import('../../components/contacts/contacts.routes').then(
        (r) => r.contacts,
      ),
  },
  {
    path: 'task',
    loadChildren: () =>
      import('../../components/task/task.routes').then((r) => r.task),
  },
  {
    path: 'calendar',
    loadChildren: () =>
      import('../../components/calendar/calendar.routes').then(
        (r) => r.calendar,
      ),
  },
  {
    path: 'social-app',
    loadChildren: () =>
      import('../../components/social-app/social-app.routes').then(
        (r) => r.socialApp,
      ),
  },
  {
    path: 'to-do',
    loadChildren: () =>
      import('../../components/to-do/to-do.routes').then((r) => r.todo),
  },
  {
    path: 'search-result',
    loadChildren: () =>
      import('../../components/search-result/search-result.routes').then(
        (r) => r.searchResult,
      ),
  },
  {
    path: 'ui-kits',
    loadChildren: () =>
      import('../../components/ui-kits/ui-kits.routes').then((r) => r.uiKits),
    data: {
      title: 'Ui Kits',
      breadcrumb: 'Ui Kits',
    },
  },
  {
    path: 'bonus-ui',
    loadChildren: () =>
      import('../../components/bonus-ui/bonus-ui.routes').then(
        (r) => r.bonusUi,
      ),
    data: {
      title: 'Bonus UI',
      breadcrumb: 'Bonus UI',
    },
  },
  {
    path: 'animation',
    loadChildren: () =>
      import('../../components/animation/animation.routes').then(
        (r) => r.animation,
      ),
    data: {
      title: 'Animation',
      breadcrumb: 'Animation',
    },
  },
  {
    path: 'sample-page',
    loadChildren: () =>
      import('../../components/sample-page/sample-page.routes').then(
        (r) => r.samplePage,
      ),
    data: {
      title: 'Pages',
      breadcrumb: 'Pages',
    },
  },
  {
    path: 'icon',
    loadChildren: () =>
      import('../../components/icons/icons.routes').then((r) => r.icons),
    data: {
      title: 'Icons',
      breadcrumb: 'Icons',
    },
  },
  {
    path: 'button',
    loadChildren: () =>
      import('../../components/button/button.routes').then((r) => r.button),
  },
  {
    path: 'manage-api',
    loadChildren: () =>
      import('../../components/manage-api/manage-api.routes').then(
        (r) => r.manageAPI,
      ),
    data: {
      title: 'Pages',
      breadcrumb: 'Pages',
    },
  },
  {
    path: 'sitemap',
    loadChildren: () =>
      import('../../components/sitemap/sitemap.routes').then((r) => r.siteMap),
    data: {
      title: 'Pages',
      breadcrumb: 'Pages',
    },
  },
  {
    path: 'internationalization',
    loadChildren: () =>
      import('../../components/internationalization/internationalization.routes').then(
        (r) => r.internationalization,
      ),
    data: {
      title: 'Pages',
      breadcrumb: 'Pages',
    },
  },
];
