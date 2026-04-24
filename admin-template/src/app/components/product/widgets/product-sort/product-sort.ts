import { Component, inject } from '@angular/core';

import { FeatherIcon } from '../../../../shared/components/ui/feather-icon/feather-icon';
import { ProductService } from '../../../../shared/services/product.service';

@Component({
  selector: 'app-product-sort',
  imports: [FeatherIcon],
  templateUrl: './product-sort.html',
  styleUrl: './product-sort.scss',
})
export class ProductSort {
  productService = inject(ProductService);
}
