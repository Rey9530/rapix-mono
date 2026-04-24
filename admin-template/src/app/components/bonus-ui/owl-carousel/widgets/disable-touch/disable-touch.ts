import { Component } from '@angular/core';

import { CarouselModule } from 'ngx-owl-carousel-o';

import { Card } from '../../../../../shared/components/ui/card/card';
import { disable } from '../../../../../shared/data/bonus-ui/owl-carousel';

@Component({
  selector: 'app-disable-touch',
  imports: [CarouselModule, Card],
  templateUrl: './disable-touch.html',
  styleUrl: './disable-touch.scss',
})
export class DisableTouch {
  public disable = disable;

  public options = {
    loop: true,
    mouseDrag: false,
    autoplay: false,
    dots: false,
    nav: true,
    navSpeed: 1000,
    disable: true,
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
