import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

import { Card } from '../../../../../shared/components/ui/card/card';
import { productCategory } from '../../../../../shared/data/dashboard/pos';

@Component({
  selector: 'app-product-category',
  imports: [RouterModule, CarouselModule, Card],
  templateUrl: './product-category.html',
  styleUrl: './product-category.scss',
})
export class ProductCategory {
  public productCategory = productCategory;
  public options: OwlOptions = {
    loop: true,
    nav: false,
    dots: false,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: {
      0: {
        items: 2,
      },
      336: {
        items: 3,
      },
      436: {
        items: 4,
      },
      674: {
        items: 5,
      },
      926: {
        items: 6,
      },
      1100: {
        items: 9,
      },
    },
  };
}
