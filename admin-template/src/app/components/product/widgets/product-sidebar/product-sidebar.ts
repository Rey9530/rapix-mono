import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import {
  brands,
  category,
  colors,
  discount,
  products,
} from '../../../../shared/data/product';
import { ProductService } from '../../../../shared/services/product.service';

@Component({
  selector: 'app-product-sidebar',
  imports: [NgbRatingModule, NgxSliderModule, DecimalPipe],
  templateUrl: './product-sidebar.html',
  styleUrl: './product-sidebar.scss',
})
export class ProductSidebar {
  private productService = inject(ProductService);

  public category = category;
  public brands = brands;
  public colors = colors;
  public discount = discount;
  public rating: number[] = Array.from({ length: 5 }, (_, i) => i + 1);

  public value: number = 800;
  public maxValue: number = 200;
  public priceArray: number[] = [];

  public sliderOption: Options = {
    floor: 0,
    ceil: 200,
  };

  public filter = {
    category: '',
    brand: '',
    color: '',
    discount: '',
    rating: null,
  };

  constructor() {
    products.forEach((price) => {
      this.priceArray.push(Number(price.price));
    });
    let maxPrice = Math.max(...this.priceArray);

    this.sliderOption = {
      floor: 0,
      ceil: maxPrice,
    };
  }

  toggleSidebar() {
    this.productService.sidebarOpen = !this.productService.sidebarOpen;
  }

  handleColor(color: string) {
    this.filter['color'] = color;
  }
}
