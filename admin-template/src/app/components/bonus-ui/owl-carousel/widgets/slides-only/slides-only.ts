import { Component } from '@angular/core';

import { CarouselModule } from 'ngx-owl-carousel-o';

import { Card } from '../../../../../shared/components/ui/card/card';
import { slidesOnly } from '../../../../../shared/data/bonus-ui/owl-carousel';

@Component({
  selector: 'app-slides-only',
  imports: [CarouselModule, Card],
  templateUrl: './slides-only.html',
  styleUrl: './slides-only.scss',
})
export class SlidesOnly {
  public slidesOnly = slidesOnly;

  public options = {
    loop: true,
    mouseDrag: false,
    autoplay: true,
    dots: false,
    nav: false,
    navSpeed: 1000,
    navText: [
      '<i class="icon-angle-left"></i>',
      '<i class="icon-angle-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
    },
  };
}
