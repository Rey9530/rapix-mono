import { Component } from '@angular/core';

import { Card } from '../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../shared/components/ui/feather-icon/feather-icon';
import { productCategory, services } from '../../../../shared/data/product';

@Component({
  selector: 'app-product-details-sidebar',
  imports: [Card, FeatherIcon],
  templateUrl: './product-details-sidebar.html',
  styleUrl: './product-details-sidebar.scss',
})
export class ProductDetailsSidebar {
  public productCategory = productCategory;
  public services = services;
}
