import { Component } from '@angular/core';

import { CarouselModule } from 'ngx-owl-carousel-o';

import { Card } from '../../../../../shared/components/ui/card/card';
import { darkVariant } from '../../../../../shared/data/bonus-ui/owl-carousel';

@Component({
  selector: 'app-dark-variant',
  imports: [CarouselModule, Card],
  templateUrl: './dark-variant.html',
  styleUrl: './dark-variant.scss',
})
export class IDarkVariant {
  public darkVariant = darkVariant;

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
