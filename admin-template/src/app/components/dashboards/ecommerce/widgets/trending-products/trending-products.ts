import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { trendingProducts } from '../../../../../shared/data/dashboard/e-commerce';
import { ITableConfigs } from '../../../../../shared/interface/common';
import { ITrendingProducts } from '../../../../../shared/interface/dashboard/e-commerce';

@Component({
  selector: 'app-trending-products',
  imports: [Card, Table],
  templateUrl: './trending-products.html',
  styleUrl: './trending-products.scss',
})
export class TrendingProducts {
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  public cardToggleOption = cardToggleOptions3;

  public tableConfig: ITableConfigs<ITrendingProducts> = {
    columns: [
      { title: 'Product Name', field_value: 'product_name', sort: true },
      { title: 'Category', field_value: 'category', sort: true },
      { title: 'Sold', field_value: 'sold_item', sort: true },
    ],
    data: [] as ITrendingProducts[],
  };

  ngOnInit() {
    window.navigate = () => {
      void this.router.navigate(['/product/list']);
    };

    this.tableConfig.data = trendingProducts.map(
      (product: ITrendingProducts) => {
        const formattedProduct = { ...product };
        formattedProduct.product_name = this.sanitizer
          .bypassSecurityTrustHtml(`<div class="common-flex align-items-center">
                              <img class="img-fluid rounded-circle" src="${product.product_image}" alt="user">
                              <a class="f-w-500" href="javascript:void(0)" onclick="navigate()">${product.product_name}</a>
                            </div>`);

        return formattedProduct;
      },
    );
  }
}
