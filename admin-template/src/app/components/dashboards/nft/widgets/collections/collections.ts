import { Component, viewChild } from '@angular/core';

import {
  CarouselComponent,
  CarouselModule,
  OwlOptions,
  SlidesOutputData,
} from 'ngx-owl-carousel-o';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions1 } from '../../../../../shared/data/common';
import { collections } from '../../../../../shared/data/dashboard/nft';

@Component({
  selector: 'app-collections',
  imports: [CarouselModule, Card],
  templateUrl: './collections.html',
  styleUrls: ['./collections.scss'],
})
export class Collections {
  readonly thumbnailCarousel =
    viewChild<CarouselComponent>('thumbnailCarousel');

  public cardToggleOption = cardToggleOptions1;
  public collections = collections;
  public activeSlide: string = '0';

  public productMainThumbSlider: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    dotsData: true,
    autoplayHoverPause: false,
    nav: false,
    autoplay: false,
    navSpeed: 300,
    autoHeight: true,
    responsive: {
      0: {
        items: 1,
      },
    },
  };

  public productThumbSlider: OwlOptions = {
    loop: false,
    dots: false,
    margin: 16,
    navSpeed: 300,
    autoHeight: true,
    items: 3,
    responsive: {
      0: {
        items: 3,
        autoHeight: true,
      },
      400: {
        items: 3,
      },
    },
  };

  onCarouselLoad() {
    this.activeSlide = '1';
  }

  onSlideChange(event: SlidesOutputData) {
    if (this.collections) {
      if (
        this.thumbnailCarousel &&
        event &&
        event.slides &&
        event.slides[0].id &&
        event.slides.length > 0
      ) {
        this.activeSlide = event.slides[0].id;

        if (this.activeSlide) {
          this.thumbnailCarousel()?.to(this.activeSlide);
        }
      }
    }
  }
}
