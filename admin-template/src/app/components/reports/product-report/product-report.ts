import { Component } from '@angular/core';

import { Card } from '../../../shared/components/ui/card/card';
import { Table } from '../../../shared/components/ui/table/table';
import { productReports } from '../../../shared/data/reports';
import { ITableConfigs } from '../../../shared/interface/common';
import { IProductReports } from '../../../shared/interface/reports';

@Component({
  selector: 'app-product-report',
  imports: [Card, Table],
  templateUrl: './product-report.html',
  styleUrl: './product-report.scss',
})
export class ProductReport {
  public products: IProductReports[];

  public tableConfig: ITableConfigs<IProductReports> = {
    columns: [
      { title: 'Product Name', field_value: 'product_name', sort: true },
      { title: 'SKU', field_value: 'sku', sort: true },
      { title: 'Total Product Sold', field_value: 'product_sold', sort: true },
      {
        title: 'Price',
        field_value: 'price',
        sort: true,
        type: 'price',
        decimal_number: true,
      },
      { title: 'Rating', field_value: 'rating', sort: true },
    ],
    data: [] as IProductReports[],
  };

  ngOnInit() {
    this.tableConfig.data = this.formatProductDetails(productReports);
    this.products = productReports;
  }

  private formatProductDetails(products: IProductReports[]) {
    return products.map((product: IProductReports) => {
      const formattedProducts = { ...product };
      formattedProducts.product_name = `<div class="product-names">
                                          <div class="light-product-box">
                                            <img class="img-fluid" src="${product.product_image}" alt="${product.product_name}">
                                          </div>
                                          <p>${product.product_name}</p>
                                        </div>`;

      const totalStars = 5;
      let starsHtml = '';
      for (let i = 0; i < Number(product.rating); i++) {
        starsHtml += '<i class="fa-solid fa-star txt-warning"></i>';
      }

      for (let i = Number(product.rating); i < totalStars; i++) {
        starsHtml += '<i class="fa-regular fa-star txt-warning"></i>';
      }

      formattedProducts.rating = `<div class="rating">${starsHtml}</div>`;
      formattedProducts.date = `${product.date}`;

      return formattedProducts;
    });
  }
}
