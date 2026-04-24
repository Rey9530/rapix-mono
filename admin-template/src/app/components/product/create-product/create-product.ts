import { Component } from '@angular/core';

import { OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { AddProductDetails } from './add-product-details/add-product-details';
import { AdditionalOptions } from './additional-options/additional-options';
import { ProductCategories } from './product-categories/product-categories';
import { ProductGallery } from './product-gallery/product-gallery';
import { ProductPriceDiscount } from './product-price-discount/product-price-discount';
import { SvgIcon } from '../../../shared/components/ui/svg-icon/svg-icon';
import { addProduct } from '../../../shared/data/product';

@Component({
  selector: 'app-create-product',
  imports: [
    NgbNavModule,
    OwlNativeDateTimeModule,
    SvgIcon,
    AddProductDetails,
    ProductGallery,
    ProductCategories,
    ProductPriceDiscount,
    AdditionalOptions,
  ],
  templateUrl: './create-product.html',
  styleUrl: './create-product.scss',
})
export class CreateProduct {
  public active = 1;
  public addProduct = addProduct;

  changeTab(value: number) {
    this.active = value;
  }
}
