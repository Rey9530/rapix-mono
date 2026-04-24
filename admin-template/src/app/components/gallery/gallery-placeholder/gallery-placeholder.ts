import { Component, inject } from '@angular/core';

import { Gallery, GalleryItem, ImageItem } from 'ng-gallery';
import { Lightbox, LightboxModule } from 'ng-gallery/lightbox';

import { galleryPlaceholder } from '../../../shared/data/gallery';

@Component({
  selector: 'app-gallery-placeholder',
  imports: [LightboxModule],
  templateUrl: './gallery-placeholder.html',
  styleUrl: './gallery-placeholder.scss',
})
export class GalleryPlaceholder {
  gallery = inject(Gallery);
  lightbox = inject(Lightbox);

  public galleryPlaceholder = galleryPlaceholder;
  public loader: number[] = Array.from({ length: 12 }, (_, index) => index);
  public isLoading: boolean = true;
  public items: GalleryItem[];
  public galleryId = 'myLightbox';

  ngOnInit() {
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);

    this.items = this.galleryPlaceholder.map(
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
