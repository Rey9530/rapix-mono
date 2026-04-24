import { Component, inject, viewChild } from '@angular/core';

import { Gallery, GalleryItem, ImageItem } from 'ng-gallery';
import { Lightbox, LightboxModule } from 'ng-gallery/lightbox';
import {
  NgxMasonryComponent,
  NgxMasonryModule,
  NgxMasonryOptions,
} from 'ngx-masonry';

import { Card } from '../../../shared/components/ui/card/card';
import { masonryImage } from '../../../shared/data/gallery';

@Component({
  selector: 'app-masonry-gallery',
  imports: [NgxMasonryModule, LightboxModule, Card],
  templateUrl: './masonry-gallery.html',
  styleUrl: './masonry-gallery.scss',
})
export class MasonryGallery {
  gallery = inject(Gallery);
  lightbox = inject(Lightbox);

  readonly masonry = viewChild.required(NgxMasonryComponent);

  public masonryImage = masonryImage;
  public masonryOptions: NgxMasonryOptions = {
    gutter: 20,
  };
  public items: GalleryItem[];
  public galleryId = 'myLightbox';

  ngOnInit() {
    this.items = this.masonryImage.map(
      (item) => new ImageItem({ src: item.preview_url, thumb: item.src_url }),
    );

    const galleryRef = this.gallery.ref(this.galleryId);
    galleryRef.load(this.items);
  }

  openInFullScreen(index: number) {
    this.lightbox.open(index, this.galleryId, {
      panelClass: 'fullscreen',
    });
  }
}
