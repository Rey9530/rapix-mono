import { Component } from '@angular/core';

import { PosCheckout } from './widgets/pos-checkout/pos-checkout';
import { Product } from './widgets/product/product';
import { ProductCategory } from './widgets/product-category/product-category';

@Component({
  selector: 'app-pos',
  imports: [ProductCategory, Product, PosCheckout],
  templateUrl: './pos.html',
  styleUrl: './pos.scss',
})
export class Pos {}
