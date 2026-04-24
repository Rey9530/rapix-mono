import { Component } from '@angular/core';

import { CarouselModule } from 'ngx-owl-carousel-o';

import { Card } from '../../../../../shared/components/ui/card/card';
import { crossFade } from '../../../../../shared/data/bonus-ui/owl-carousel';

@Component({
  selector: 'app-cross-fade',
  imports: [CarouselModule, Card],
  templateUrl: './cross-fade.html',
  styleUrl: './cross-fade.scss',
})
export class CrossFade {
  public crossFade = crossFade;

  public options = {
    loop: true,
    mouseDrag: false,
    nav: true,
    dots: true,
    autoplay: true,
    navSpeed: 700,
    navText: [
      '<i class="icon-angle-left"></i>',
      '<i class="icon-angle-right"></i>',
    ],
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    responsive: {
      0: {
        items: 1,
      },
    },
  };
}
