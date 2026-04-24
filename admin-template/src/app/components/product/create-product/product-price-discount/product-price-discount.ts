import { Component, input, output } from '@angular/core';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Select2Module } from 'ng-select2-component';

import { SvgIcon } from '../../../../shared/components/ui/svg-icon/svg-icon';
import { bogoProducts, priceDiscount } from '../../../../shared/data/product';

@Component({
  selector: 'app-product-price-discount',
  imports: [Select2Module, NgbNavModule, SvgIcon],
  templateUrl: './product-price-discount.html',
  styleUrl: './product-price-discount.scss',
})
export class ProductPriceDiscount {
  readonly active = input<number>(0);

  readonly changeTab = output<number>();

  public bogoProducts = bogoProducts;
  public priceDiscount = priceDiscount;

  next() {
    const nextTab = this.active() + 1;
    this.changeTab.emit(nextTab);
  }

  previous() {
    const prevTab = this.active() - 1;
    this.changeTab.emit(prevTab);
  }
}
