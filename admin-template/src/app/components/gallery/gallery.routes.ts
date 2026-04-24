import { Routes } from '@angular/router';

export const gallery: Routes = [
  {
    path: 'gallery-grid',
    loadComponent: () =>
      import('./gallery-grid/gallery-grid').then((m) => m.GalleryGrid),
    data: {
      title: 'Gallery',
      breadcrumb: 'Gallery',
    },
  },
  {
    path: 'gallery-grid-desc',
    loadComponent: () =>
      import('./gallery-grid-desc/gallery-grid-desc').then(
        (m) => m.GalleryGridDesc,
      ),
    data: {
      title: 'Gallery Grid With Description',
      breadcrumb: 'Gallery Grid With Description',
    },
  },
  {
    path: 'masonry-gallery',
    loadComponent: () =>
      import('./masonry-gallery/masonry-gallery').then((m) => m.MasonryGallery),
    data: {
      title: 'Masonry Gallery',
      breadcrumb: 'Masonry Gallery',
    },
  },
  {
    path: 'masonry-with-desc',
    loadComponent: () =>
      import('./masonry-with-desc/masonry-with-desc').then(
        (m) => m.MasonryWithDesc,
      ),
    data: {
      title: 'Masonry Gallery With Description',
      breadcrumb: 'Masonry Gallery With Description',
    },
  },
  {
    path: 'hover-effects',
    loadComponent: () =>
      import('./hover-effect/hover-effect').then((m) => m.HoverEffect),
    data: {
      title: 'Image Hover Effects',
      breadcrumb: 'Image Hover Effects',
    },
  },
  {
    path: 'gallery-placeholder',
    loadComponent: () =>
      import('./gallery-placeholder/gallery-placeholder').then(
        (m) => m.GalleryPlaceholder,
      ),
    data: {
      title: 'Gallery With Placeholder',
      breadcrumb: 'Gallery With Placeholder',
    },
  },
];
