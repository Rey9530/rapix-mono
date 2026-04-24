import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Products } from './products/products';
import { ProductService } from '../../../shared/services/product.service';
import { ProductSidebar } from '../widgets/product-sidebar/product-sidebar';

@Component({
  selector: 'app-product-list',
  imports: [RouterModule, ProductSidebar, Products],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  productService = inject(ProductService);
}
