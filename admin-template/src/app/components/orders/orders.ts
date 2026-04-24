import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { OrderFilter } from './widgets/order-filter/order-filter';
import { Card } from '../../shared/components/ui/card/card';
import { Table } from '../../shared/components/ui/table/table';
import { orders } from '../../shared/data/order';
import {
  ITableClickedAction,
  ITableConfigs,
} from '../../shared/interface/common';
import { IOrder } from '../../shared/interface/order';

@Component({
  selector: 'app-orders',
  imports: [OrderFilter, Card, Table],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders {
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  public orders = orders;

  public tableConfig: ITableConfigs<IOrder> = {
    columns: [
      { title: 'Order Number', field_value: 'order_number', sort: true },
      { title: 'Order Date', field_value: 'order_date', sort: true },
      { title: 'Customer Name', field_value: 'customer_name', sort: true },
      { title: 'Total Amount', field_value: 'total_amount', sort: true },
      { title: 'Payment Status', field_value: 'payment_status', sort: true },
      { title: 'Payment Method', field_value: 'payment_method', sort: true },
    ],
    row_action: [
      { label: 'View', action_to_perform: 'view', icon: 'eye' },
      {
        label: 'Delete',
        action_to_perform: 'delete',
        icon: 'trash1',
        modal: true,
        model_text: 'Do you really want to delete the order History?',
      },
    ],
    data: [] as IOrder[],
  };

  ngOnInit() {
    window.navigate = () => {
      void this.router.navigate(['/order/1']);
    };

    this.tableConfig.data = this.order(this.orders);
  }

  handleAction(value: ITableClickedAction<IOrder>) {
    if (value.action_to_perform === 'view' && value.data) {
      const order = this.orders.find((order) => order.id == value.data!.id);
      if (order) {
        this.router.navigate([`/order/${order.order_number}`]);
      }
    }
    if (value.action_to_perform === 'delete' && value.data) {
      this.orders = this.orders.filter(
        (order: IOrder) => order.id !== value.data!.id,
      );
      this.tableConfig = { ...this.tableConfig, data: this.order(this.orders) };
    }
  }

  private order(orders: IOrder[]) {
    return orders.map((order: IOrder) => {
      const formattedOrder = { ...order };

      formattedOrder.order_number = this.sanitizer.bypassSecurityTrustHtml(
        `<a href="javascript:void(0)" onclick="navigate()">#${order.order_number}</a>`,
      );
      formattedOrder.order_date = `<p class="c-o-light">${order.order_date}</p>`;
      formattedOrder.customer_name = `<p class="c-o-light">${order.customer_name}</p>`;
      formattedOrder.total_amount = `<p class="c-o-light">$${order.total_amount}</p>`;
      formattedOrder.payment_status = `<span class="badge badge-light-${
        order.payment_status == 'Pending'
          ? 'warning'
          : order.payment_status == 'Failed'
            ? 'danger'
            : order.payment_status == 'Completed'
              ? 'success'
              : ''
      }">${order.payment_status}</span>`;

      return formattedOrder;
    });
  }
}
