import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Card } from '../../../../shared/components/ui/card/card';
import { Table } from '../../../../shared/components/ui/table/table';
import { recentOrders } from '../../../../shared/data/store';
import { ITableConfigs } from '../../../../shared/interface/common';
import { IRecentOrders } from '../../../../shared/interface/store';

@Component({
  selector: 'app-recent-orders',
  imports: [Card, Table],
  templateUrl: './recent-orders.html',
  styleUrl: './recent-orders.scss',
})
export class RecentOrders {
  private sanitizer = inject(DomSanitizer);

  public tableConfig: ITableConfigs<IRecentOrders> = {
    columns: [
      { title: 'Order Number', field_value: 'order_number', sort: true },
      { title: 'Date', field_value: 'date', sort: true },
      { title: 'Customers', field_value: 'customer_name', sort: true },
      { title: 'Amount', field_value: 'amount', sort: true },
      { title: 'Payment', field_value: 'payment', sort: true },
    ],
    row_action: [
      {
        label: 'View',
        action_to_perform: 'view',
        icon: 'eye',
        path: '/order/details',
      },
    ],
    data: [] as IRecentOrders[],
  };

  ngOnInit() {
    this.tableConfig.data = recentOrders.map((order: IRecentOrders) => {
      const formattedOrder = { ...order };
      formattedOrder.order_number = `<a>${order.order_number}</a>`;
      formattedOrder.date = `<p class="c-o-light">${order.date}</p>`;
      formattedOrder.customer_name = this.sanitizer
        .bypassSecurityTrustHtml(`<div class="common-flex align-items-center">
                                      <img class="img-fluid rounded-circle" src="${order.customer_profile}" alt="user">
                                      <a href="javascript:void(0)"  onclick="navigate()">${order.customer_name}</a>
                                  </div>`);

      formattedOrder.amount = `<p class="c-o-light">$${order.amount}</p>`;

      formattedOrder.payment = `<span class="badge badge-light-${
        order.payment == 'Completed'
          ? 'success'
          : order.payment == 'Shipped'
            ? 'secondary'
            : order.payment == 'Pending'
              ? 'warning'
              : ''
      }">${order.payment}</span>`;

      return formattedOrder;
    });
  }
}
