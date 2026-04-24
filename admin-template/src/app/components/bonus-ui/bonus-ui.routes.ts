import { Routes } from '@angular/router';

export const bonusUi: Routes = [
  {
    path: 'scrollable',
    loadComponent: () =>
      import('./scrollable/scrollable').then((m) => m.Scrollable),
    data: {
      title: 'Scrollable',
      breadcrumb: 'Scrollable',
    },
  },
  {
    path: 'tree',
    loadComponent: () =>
      import('./tree-view/tree-view').then((m) => m.TreeView),
    data: {
      title: 'Tree view',
      breadcrumb: 'Tree view',
    },
  },
  {
    path: 'block-ui',
    loadComponent: () => import('./block-ui/block-ui').then((m) => m.BlockUi),
    data: {
      title: 'Block Ui',
      breadcrumb: 'BlockUI',
    },
  },
  {
    path: 'rating',
    loadComponent: () => import('./rating/rating').then((m) => m.Rating),
    data: {
      title: 'Rating',
      breadcrumb: 'Rating',
    },
  },
  {
    path: 'dropzone',
    loadComponent: () => import('./dropzone/dropzone').then((m) => m.Dropzone),
    data: {
      title: 'Dropzone',
      breadcrumb: 'Dropzone',
    },
  },
  {
    path: 'owl-carousel',
    loadComponent: () =>
      import('./owl-carousel/owl-carousel').then((m) => m.OwlCarousel),
    data: {
      title: 'Owl Carousel',
      breadcrumb: 'Owl Carousel',
    },
  },
  {
    path: 'toast',
    loadComponent: () => import('./toast/toast').then((m) => m.Toast),
    data: {
      title: 'Toasts',
      breadcrumb: 'Toasts',
    },
  },
  {
    path: 'sweetalert2',
    loadComponent: () =>
      import('./sweetalert2/sweetalert2').then((m) => m.Sweetalert2),
    data: {
      title: 'Sweet Alerts',
      breadcrumb: 'Sweet Alerts',
    },
  },
  {
    path: 'animated-modal',
    loadComponent: () =>
      import('./animated-modal/animated-modal').then((m) => m.AnimatedModal),
    data: {
      title: 'Animated Modal',
      breadcrumb: 'Animated Modal',
    },
  },
  {
    path: 'scrollspy',
    loadComponent: () =>
      import('./scrollspy/scrollspy').then((m) => m.Scrollspy),
    data: {
      title: 'ScrollSpy',
      breadcrumb: 'ScrollSpy',
    },
  },
  {
    path: 'draggable-card',
    loadComponent: () =>
      import('./draggable-card/draggable-card').then((m) => m.DraggableCard),
    data: {
      title: 'Draggable Card',
      breadcrumb: 'Draggable Card',
    },
  },
  {
    path: 'ribbons',
    loadComponent: () => import('./ribbons/ribbons').then((m) => m.Ribbons),
    data: {
      title: 'Ribbons',
      breadcrumb: 'Ribbons',
    },
  },
  {
    path: 'pagination',
    loadComponent: () =>
      import('./pagination/pagination').then((m) => m.Pagination),
    data: {
      title: 'Paginations',
      breadcrumb: 'Paginations',
    },
  },
  {
    path: 'breadcrumb',
    loadComponent: () =>
      import('./breadcrumb/breadcrumb').then((m) => m.Breadcrumb),
    data: {
      title: 'Breadcrumb',
      breadcrumb: 'Breadcrumb',
    },
  },
  {
    path: 'range-slider',
    loadComponent: () =>
      import('./range-slider/range-slider').then((m) => m.RangeSlider),
    data: {
      title: 'Range Slider',
      breadcrumb: 'Range Slider',
    },
  },
  {
    path: 'ratios',
    loadComponent: () => import('./ratios/ratios').then((m) => m.Ratios),
    data: {
      title: 'Ratios',
      breadcrumb: 'Ratios',
    },
  },
  {
    path: 'image-cropper',
    loadComponent: () =>
      import('./image-crop/image-crop').then((m) => m.ImageCrop),
    data: {
      title: 'Image Cropper',
      breadcrumb: 'Image Cropper',
    },
  },
  {
    path: 'basic-card',
    loadComponent: () =>
      import('./basic-cards/basic-cards').then((m) => m.BasicCards),
    data: {
      title: 'Basic Card',
      breadcrumb: 'Basic Card',
    },
  },
  {
    path: 'creative-card',
    loadComponent: () =>
      import('./creative-card/creative-card').then((m) => m.CreativeCard),
    data: {
      title: 'Creative Card',
      breadcrumb: 'Creative Card',
    },
  },
  {
    path: 'timeline',
    loadComponent: () => import('./timeline/timeline').then((m) => m.Timeline),
    data: {
      title: 'Timeline',
      breadcrumb: 'Timeline',
    },
  },
];
