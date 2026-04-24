import { Component, viewChild } from '@angular/core';

import { NgxImageZoomModule } from 'ngx-image-zoom';
import {
  CarouselComponent,
  CarouselModule,
  OwlOptions,
  SlidesOutputData,
} from 'ngx-owl-carousel-o';

import { Card } from '../../../shared/components/ui/card/card';
import { ProductContent } from '../widgets/product-content/product-content';
import { ProductDetailsSidebar } from '../widgets/product-details-sidebar/product-details-sidebar';
import { ProductDetailsTab } from '../widgets/product-details-tab/product-details-tab';

@Component({
  selector: 'app-product-details',
  imports: [
    CarouselModule,
    NgxImageZoomModule,
    Card,
    ProductContent,
    ProductDetailsSidebar,
    ProductDetailsTab,
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails {
  public activeSlide: string = '1';

  public images = [
    { id: 1, img: 'assets/images/ecommerce/01.jpg' },
    { id: 2, img: 'assets/images/ecommerce/02.jpg' },
    { id: 3, img: 'assets/images/ecommerce/03.jpg' },
    { id: 4, img: 'assets/images/ecommerce/04.jpg' },
    { id: 5, img: 'assets/images/ecommerce/05.jpg' },
    { id: 6, img: 'assets/images/ecommerce/06.jpg' },
    { id: 7, img: 'assets/images/ecommerce/07.jpg' },
    { id: 8, img: 'assets/images/ecommerce/08.jpg' },
  ];

  public productMainThumbSlider: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    dotsData: true,
    autoplayHoverPause: false,
    nav: false,
    autoplay: true,
    navSpeed: 300,
    autoHeight: true,
    responsive: {
      0: {
        items: 1,
      },
    },
  };

  public productThumbSlider: OwlOptions = {
    loop: true,
    dots: false,
    margin: 16,
    navSpeed: 300,
    autoHeight: true,
    items: 4,
    responsive: {
      0: {
        items: 3,
        autoHeight: true,
      },
      400: {
        items: 4,
      },
    },
  };

  readonly thumbnailCarousel =
    viewChild<CarouselComponent>('thumbnailCarousel');

  onCarouselLoad() {
    this.activeSlide = '1';
  }
  onSlideChange(event: SlidesOutputData) {
    const thumbnailCarousel = this.thumbnailCarousel();

    if (this.images && event?.slides?.length && thumbnailCarousel) {
      const firstSlide = event.slides[0];
      if (firstSlide?.id) {
        this.activeSlide = firstSlide.id;
        thumbnailCarousel.to(this.activeSlide);
      }
    }
  }
}
