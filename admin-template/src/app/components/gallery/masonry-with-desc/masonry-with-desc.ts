import { Component, inject, viewChild } from '@angular/core';

import { Gallery, GalleryItem, ImageItem } from 'ng-gallery';
import { Lightbox, LightboxModule } from 'ng-gallery/lightbox';
import {
  NgxMasonryComponent,
  NgxMasonryModule,
  NgxMasonryOptions,
} from 'ngx-masonry';

import { Card } from '../../../shared/components/ui/card/card';
import { masonryImageDesc } from '../../../shared/data/gallery';

@Component({
  selector: 'app-masonry-with-desc',
  imports: [NgxMasonryModule, LightboxModule, Card],
  templateUrl: './masonry-with-desc.html',
  styleUrl: './masonry-with-desc.scss',
})
export class MasonryWithDesc {
  gallery = inject(Gallery);
  lightbox = inject(Lightbox);

  readonly masonry = viewChild(NgxMasonryComponent);

  public masonryImageDesc = masonryImageDesc;
  public masonryOptions: NgxMasonryOptions = {
    gutter: 20,
  };

  public items: GalleryItem[];
  public galleryId = 'myLightbox';

  ngOnInit() {
    this.items = this.masonryImageDesc.map(
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
