import { Component, inject } from '@angular/core';

import { Card } from '../../../shared/components/ui/card/card';
import { Table } from '../../../shared/components/ui/table/table';
import { customerOrderReport } from '../../../shared/data/reports';
import { ITableConfigs } from '../../../shared/interface/common';
import { ICustomerOrderReport } from '../../../shared/interface/reports';
import { ChatService } from '../../../shared/services/chat.service';

@Component({
  selector: 'app-customer-order-report',
  imports: [Card, Table],
  templateUrl: './customer-order-report.html',
  styleUrl: './customer-order-report.scss',
})
export class CustomerOrderReport {
  private chatService = inject(ChatService);

  public customerOrder: ICustomerOrderReport[];

  public tableConfig: ITableConfigs<ICustomerOrderReport> = {
    columns: [
      { title: 'Customer Name', field_value: 'customer_name', sort: true },
      { title: 'Customer Group', field_value: 'customer_group', sort: true },
      { title: 'No. Of Orders', field_value: 'orders', sort: true },
      { title: 'No. Of Products', field_value: 'items', sort: true },
      { title: 'Total', field_value: 'total', sort: true, type: 'price' },
    ],
    data: [] as ICustomerOrderReport[],
  };

  ngOnInit() {
    this.tableConfig.data = this.formatCustomerOrder(customerOrderReport);
    this.customerOrder = customerOrderReport;
  }

  private formatCustomerOrder(orders: ICustomerOrderReport[]) {
    return orders.map((order: ICustomerOrderReport) => {
      const formattedOrder = { ...order };
      formattedOrder.customer_name = `<div class="customer-details">
                                        <img class="img-fluid" src="${order.customer_profile}" alt="${order.customer_name}">
                                        <div>
                                        <a href="javascript:void(0">${order.customer_name}</a>
                                          <p class="c-o-light">${order.customer_email}</p>
                                        </div>
                                      </div>`;

      let customerGroupHTML = '';
      if (Array.isArray(order.customer_group)) {
        for (let i = 0; i < order.customer_group.length; i++) {
          if (order.customer_group[i]['profile']) {
            customerGroupHTML += `<li>
                                  <img class="common-circle" src="${order.customer_group[i]['profile']}" alt="user">
                                </li>`;
          } else {
            customerGroupHTML += `<li> 
                                  <div class="common-circle bg-lighter-${this.chatService.getTextColor(this.chatService.getUserText(order.customer_group[i]['name']))}">${this.chatService.getUserText(order.customer_group[i]['name'], 'singleText')}</div>
                                </li>`;
          }
        }
      }
      formattedOrder.customer_group = `<ul class="common-f-start customer-group">
                                        ${customerGroupHTML}
                                      </ul>`;

      return formattedOrder;
    });
  }
}
