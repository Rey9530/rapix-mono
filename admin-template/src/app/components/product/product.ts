import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ProductBox } from './widgets/product-box/product-box';
import { ProductSidebar } from './widgets/product-sidebar/product-sidebar';
import { ProductSort } from './widgets/product-sort/product-sort';
import { products } from '../../shared/data/product';
import { ProductService } from '../../shared/services/product.service';

@Component({
  selector: 'app-product',
  imports: [RouterModule, ProductSort, ProductSidebar, ProductBox],
  templateUrl: './product.html',
  styleUrl: './product.scss',
})
export class Product {
  productService = inject(ProductService);

  public products = products;
}
