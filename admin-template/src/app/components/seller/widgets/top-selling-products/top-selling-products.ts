import { Component } from '@angular/core';

import { Card } from '../../../../shared/components/ui/card/card';
import { Table } from '../../../../shared/components/ui/table/table';
import { topSellingProducts } from '../../../../shared/data/store';
import { ITableConfigs } from '../../../../shared/interface/common';
import { ITopSellingProduct } from '../../../../shared/interface/store';

@Component({
  selector: 'app-top-selling-products',
  imports: [Card, Table],
  templateUrl: './top-selling-products.html',
  styleUrl: './top-selling-products.scss',
})
export class TopSellingProducts {
  public tableConfig: ITableConfigs<ITopSellingProduct> = {
    columns: [
      { title: 'Product', field_value: 'product_name', sort: true },
      { title: 'Category', field_value: 'category', sort: true },
      { title: 'Price', field_value: 'price', sort: true },
      { title: 'Orders', field_value: 'orders', sort: true },
      { title: 'Stock', field_value: 'stock', sort: true },
      { title: 'Total Amount', field_value: 'total_amount', sort: true },
    ],
    data: [] as ITopSellingProduct[],
  };

  ngOnInit() {
    this.tableConfig.data = topSellingProducts.map(
      (product: ITopSellingProduct) => {
        const formattedProduct = { ...product };
        formattedProduct.product_name = `<div class="product-names">
                                <div class="light-product-box">
                                  <img class="img-fluid" src="${product.product_image}" alt="${product.product_name}"></div>
                                <p>${product.product_name}</p>
                              </div>`;
        product.category = `<p class="c-o-light">${product.category}</p>`;
        formattedProduct.price = `<p class="c-o-light">${'$' + product.price}</p>`;
        formattedProduct.orders = `<p class="c-o-light">${product.orders}</p>`;
        formattedProduct.stock = `<p class="c-o-light">${product.stock}</p>`;
        formattedProduct.total_amount = `<p class="c-o-light">${'$' + product.total_amount}</p>`;

        return formattedProduct;
      },
    );
  }
}
