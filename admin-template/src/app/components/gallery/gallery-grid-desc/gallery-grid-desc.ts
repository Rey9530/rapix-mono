import { Component, inject } from '@angular/core';

import {
  Gallery,
  GalleryItem,
  GalleryModule,
  ImageItem,
  ImageSize,
  ThumbnailsPosition,
} from 'ng-gallery';
import { Lightbox, LightboxModule } from 'ng-gallery/lightbox';

import { Card } from '../../../shared/components/ui/card/card';
import { galleryGridDesc } from '../../../shared/data/gallery';

@Component({
  selector: 'app-gallery-grid-desc',
  imports: [LightboxModule, GalleryModule, Card],
  templateUrl: './gallery-grid-desc.html',
  styleUrl: './gallery-grid-desc.scss',
})
export class GalleryGridDesc {
  gallery = inject(Gallery);
  lightbox = inject(Lightbox);

  public galleryGridDesc = galleryGridDesc;
  public items: GalleryItem[];

  ngOnInit() {
    this.items = this.galleryGridDesc.map(
      (item) => new ImageItem({ src: item.src_url, thumb: item.src_url }),
    );
    const lightboxRef = this.gallery.ref('lightbox');

    lightboxRef.setConfig({
      imageSize: ImageSize.Cover,
      thumbPosition: ThumbnailsPosition.Bottom,
    });

    lightboxRef.load(this.items);
  }
}
