import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { cardToggleOptions1 } from '../../../../../shared/data/common';
import { recentOrders } from '../../../../../shared/data/dashboard/default';
import { ITableConfigs } from '../../../../../shared/interface/common';
import { IRecentOrders } from '../../../../../shared/interface/dashboard/default';

@Component({
  selector: 'app-recent-orders',
  imports: [Card, Table],
  templateUrl: './recent-orders.html',
  styleUrl: './recent-orders.scss',
})
export class RecentOrders {
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  public cardToggleOptions = cardToggleOptions1;

  public tableConfig: ITableConfigs<IRecentOrders> = {
    columns: [
      { title: 'Product Name', field_value: 'product_name', sort: true },
      { title: 'Customers', field_value: 'customer_name', sort: true },
      { title: 'Qty', field_value: 'quantity', sort: true, type: 'qty' },
      {
        title: 'Total Price',
        field_value: 'total_price',
        sort: true,
        type: 'price',
      },
      { title: 'Order Date', field_value: 'order_date', sort: true },
      { title: 'Status', field_value: 'status', sort: true },
    ],
    data: [] as IRecentOrders[],
  };

  ngOnInit() {
    window.navigate = () => {
      void this.router.navigate(['/product/details']);
    };

    this.tableConfig.data = recentOrders.map((order: IRecentOrders) => {
      const formattedOrder = { ...order };
      formattedOrder.product_name = this.sanitizer
        .bypassSecurityTrustHtml(`<div class="d-flex align-items-center gap-2">
                                  <div class="currency-icon warning">
                                    <img class="img-fluid" src="${order.product_image}" alt="${order.product_name}">
                                </div>
                                  <div> <a class="f-14 mb-0 f-w-500 c-light" href="javascript:void(0)" onclick="navigate()">${order.product_name}</a>
                                    <p class="c-o-light">${order.product_id}</p>
                                  </div>
                                </div>`);

      const statusHTML = `<button class="btn button-light-${order.status_color} txt-${order.status_color} f-w-500">${order.status}</button>`;

      formattedOrder.status =
        this.sanitizer.bypassSecurityTrustHtml(statusHTML);

      return formattedOrder;
    });
  }
}
