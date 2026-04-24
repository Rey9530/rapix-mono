import { Component, ElementRef, viewChild } from '@angular/core';

import SwiperCore from 'swiper';
import { Autoplay, Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';

import { Card } from '../../../../../shared/components/ui/card/card';
import { autoPlayVariant } from '../../../../../shared/data/bonus-ui/owl-carousel';

SwiperCore.use([Navigation, Pagination, Autoplay, Mousewheel]);

@Component({
  selector: 'app-auto-play-variant',
  imports: [Card],
  templateUrl: './auto-play-variant.html',
  styleUrl: './auto-play-variant.scss',
})
export class AutoPlayVariant {
  public autoPlayVariant = autoPlayVariant;

  readonly swiperContainer = viewChild.required<ElementRef>('swiperContainer');

  public swiperConfig: SwiperOptions = {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  };

  ngAfterViewInit() {
    const swiperContainer = this.swiperContainer();
    if (swiperContainer) {
      new SwiperCore(swiperContainer.nativeElement, this.swiperConfig);
    }
  }
}
