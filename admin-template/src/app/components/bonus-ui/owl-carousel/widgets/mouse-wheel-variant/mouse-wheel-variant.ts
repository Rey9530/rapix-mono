import { Component, ElementRef, viewChild } from '@angular/core';

import SwiperCore from 'swiper';
import { Autoplay, Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';

import { Card } from '../../../../../shared/components/ui/card/card';
import { mouseWheelVariant } from '../../../../../shared/data/bonus-ui/owl-carousel';

SwiperCore.use([Navigation, Pagination, Autoplay, Mousewheel]);

@Component({
  selector: 'app-mouse-wheel-variant',
  imports: [Card],
  templateUrl: './mouse-wheel-variant.html',
  styleUrl: './mouse-wheel-variant.scss',
})
export class MouseWheelVariant {
  public mouseWheelVariant = mouseWheelVariant;

  public swiperConfig: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 30,
    mousewheel: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  };

  readonly swiperContainer = viewChild.required<ElementRef>('swiperContainer');

  ngAfterViewInit() {
    const swiperContainer = this.swiperContainer();
    if (swiperContainer) {
      new SwiperCore(swiperContainer.nativeElement, this.swiperConfig);
    }
  }
}
