import { Component } from '@angular/core';

import { CarouselModule } from 'ngx-owl-carousel-o';

import { Card } from '../../../../../shared/components/ui/card/card';
import { withControls } from '../../../../../shared/data/bonus-ui/owl-carousel';

@Component({
  selector: 'app-with-controls',
  imports: [CarouselModule, Card],
  templateUrl: './with-controls.html',
  styleUrl: './with-controls.scss',
})
export class WithControls {
  public withControls = withControls;

  public options = {
    loop: true,
    mouseDrag: false,
    autoplay: true,
    dots: false,
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
