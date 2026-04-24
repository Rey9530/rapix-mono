import { Component, ElementRef, viewChild } from '@angular/core';

import SwiperCore from 'swiper';
import { Autoplay, Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';

import { Card } from '../../../../../shared/components/ui/card/card';
import { verticalSlider } from '../../../../../shared/data/bonus-ui/owl-carousel';

SwiperCore.use([Navigation, Pagination, Autoplay, Mousewheel]);

@Component({
  selector: 'app-vertical-slider',
  imports: [Card],
  templateUrl: './vertical-slider.html',
  styleUrl: './vertical-slider.scss',
})
export class VerticalSlider {
  public verticalSlider = verticalSlider;

  readonly swiperContainer = viewChild.required<ElementRef>('swiperContainer');

  public swiperConfig: SwiperOptions = {
    slidesPerView: 1,
    navigation: false,
    direction: 'vertical',
    autoHeight: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    loop: true,
    autoplay: { delay: 3000, disableOnInteraction: false },
  };

  ngAfterViewInit() {
    const swiperContainer = this.swiperContainer();
    if (swiperContainer) {
      new SwiperCore(swiperContainer.nativeElement, this.swiperConfig);
    }
  }
}
