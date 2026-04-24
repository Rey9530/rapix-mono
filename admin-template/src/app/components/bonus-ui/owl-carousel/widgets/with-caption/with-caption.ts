import { Component } from '@angular/core';

import { CarouselModule } from 'ngx-owl-carousel-o';

import { Card } from '../../../../../shared/components/ui/card/card';
import { withCaption } from '../../../../../shared/data/bonus-ui/owl-carousel';

@Component({
  selector: 'app-with-caption',
  imports: [CarouselModule, Card],
  templateUrl: './with-caption.html',
  styleUrl: './with-caption.scss',
})
export class WithCaption {
  public withCaption = withCaption;

  public options = {
    loop: true,
    mouseDrag: false,
    autoplay: true,
    dots: true,
    nav: true,
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
