import { Component, ElementRef, viewChild } from '@angular/core';

import SwiperCore from 'swiper';
import { Autoplay, Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';

import { Card } from '../../../../../shared/components/ui/card/card';
import { nestedSwiper } from '../../../../../shared/data/bonus-ui/owl-carousel';

SwiperCore.use([Navigation, Pagination, Autoplay, Mousewheel]);

@Component({
  selector: 'app-nested-swiper',
  imports: [Card],
  templateUrl: './nested-swiper.html',
  styleUrl: './nested-swiper.scss',
})
export class INestedSwiper {
  public nestedSwiper = nestedSwiper;

  public swiperConfig: SwiperOptions = {
    spaceBetween: 50,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  };

  public swiperConfig2: SwiperOptions = {
    direction: 'vertical',
    spaceBetween: 50,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  };

  readonly swiperContainer = viewChild.required<ElementRef>('swiperContainer');
  readonly swiperContainer2 =
    viewChild.required<ElementRef>('swiperContainer2');

  ngAfterViewInit() {
    const swiperContainer = this.swiperContainer();
    if (swiperContainer) {
      new SwiperCore(swiperContainer.nativeElement, this.swiperConfig);
    }
    const swiperContainer2 = this.swiperContainer2();
    if (swiperContainer2) {
      new SwiperCore(swiperContainer2.nativeElement, this.swiperConfig2);
    }
  }
}
