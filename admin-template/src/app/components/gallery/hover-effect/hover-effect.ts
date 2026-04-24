import { Component, inject } from '@angular/core';

import { Gallery, GalleryItem, ImageItem } from 'ng-gallery';
import { Lightbox, LightboxModule } from 'ng-gallery/lightbox';

import { Card } from '../../../shared/components/ui/card/card';
import { imgDetails } from '../../../shared/data/gallery';
import { IImages } from '../../../shared/interface/gallery';

@Component({
  selector: 'app-hover-effect',
  imports: [LightboxModule, Card],
  templateUrl: './hover-effect.html',
  styleUrl: './hover-effect.scss',
})
export class HoverEffect {
  gallery = inject(Gallery);
  lightbox = inject(Lightbox);

  public imgDetails = imgDetails;
  public items: GalleryItem[];
  public galleryId = 'myLightbox';

  openInFullScreen(index: number, images: IImages[]) {
    this.items = images.map(
      (image) =>
        new ImageItem({
          src: image.preview_url,
          thumb: image.src_url,
        }),
    );

    this.lightbox.open(index, this.galleryId, {
      panelClass: 'fullscreen',
    });

    const galleryRef = this.gallery.ref(this.galleryId);
    galleryRef.load(this.items);
  }
}
