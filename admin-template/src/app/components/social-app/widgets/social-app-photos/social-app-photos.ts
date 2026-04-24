import { Component, input, inject } from '@angular/core';

import { Gallery, GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { Lightbox, LightboxModule } from 'ng-gallery/lightbox';

import { photos } from '../../../../shared/data/social-app';

@Component({
  selector: 'app-social-app-photos',
  imports: [LightboxModule, GalleryModule],
  templateUrl: './social-app-photos.html',
  styleUrl: './social-app-photos.scss',
})
export class SocialAppPhotos {
  gallery = inject(Gallery);
  lightbox = inject(Lightbox);

  readonly likesSection = input<boolean>(true);

  public photos = photos;
  public items: GalleryItem[];
  public galleryId = 'myLightbox';

  ngOnInit() {
    this.items = this.photos.map(
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
