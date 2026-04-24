import { Component } from '@angular/core';

import { Card } from '../../../shared/components/ui/card/card';
import { Table } from '../../../shared/components/ui/table/table';
import { orderDetails, orderDetailsTab } from '../../../shared/data/order';
import { ITableConfigs } from '../../../shared/interface/common';
import { IOrderDetailsProduct } from '../../../shared/interface/order';
import { BillingDetails } from '../widgets/billing-details/billing-details';
import { CustomerDetails } from '../widgets/customer-details/customer-details';

@Component({
  selector: 'app-order-details',
  imports: [Card, Table, BillingDetails, CustomerDetails],
  templateUrl: './order-details.html',
  styleUrl: './order-details.scss',
})
export class OrderDetails {
  public currentTab: number = 3;
  public orderDetailsTab = orderDetailsTab;
  public orderDetails = orderDetails;

  public tableConfig: ITableConfigs<IOrderDetailsProduct> = {
    columns: [
      { title: 'Image', field_value: 'product_image', sort: true },
      { title: 'Product', field_value: 'product_name', sort: true },
      {
        title: 'Price',
        field_value: 'discount_price',
        sort: true,
        type: 'price',
        decimal_number: true,
      },
      { title: 'Qty', field_value: 'quantity', sort: true },
      {
        title: 'Subtotal',
        field_value: 'sub_total',
        sort: true,
        type: 'price',
        decimal_number: true,
      },
    ],
    data: [] as IOrderDetailsProduct[],
  };

  ngOnInit() {
    let products = this.orderDetails.products.map(
      (product: IOrderDetailsProduct) => {
        const formattedProduct = { ...product };
        formattedProduct.product_image = `<div class="light-product-box">
                                          <img class="img-fluid" src="${product.product_image}" alt="${product.product_name}">
                                        </div>`;

        formattedProduct.product_name = `<ul>
                                        <li>
                                          <h6> <a href="javascript:void(0)">${product.product_name}</a></h6>
                                        </li>
                                        <li>
                                          <p>${product.brand}</p><span class="common-dot"></span><span>Color:<span> ${product.color}</span></span>
                                        </li>
                                      </ul>`;

        return formattedProduct;
      },
    );

    this.tableConfig.data = products ? products : [];
  }
}
