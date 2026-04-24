import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { cardToggleOptions1 } from '../../../../../shared/data/common';
import { topCustomers } from '../../../../../shared/data/dashboard/default';
import { ITableConfigs } from '../../../../../shared/interface/common';
import { ITopCustomers } from '../../../../../shared/interface/dashboard/default';

@Component({
  selector: 'app-top-customers',
  imports: [Card, Table],
  templateUrl: './top-customers.html',
  styleUrl: './top-customers.scss',
})
export class TopCustomers {
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  public cardToggleOptions = cardToggleOptions1;
  public topCustomers = topCustomers;
  public selected: number[] = [];

  public tableConfig: ITableConfigs<ITopCustomers> = {
    columns: [
      { title: 'Customers', field_value: 'customer_name', sort: true },
      {
        title: 'Total Purchase',
        field_value: 'purchase_items',
        sort: true,
        type: 'purchase',
      },
      {
        title: 'Total Price',
        field_value: 'total_price',
        sort: true,
        type: 'price',
        class: 'f-w-500 txt-success',
        decimal_number: true,
      },
    ],
    data: [] as ITopCustomers[],
  };

  ngOnInit() {
    window.navigate = () => {
      void this.router.navigate(['/product/list']);
    };

    this.tableConfig.data = topCustomers.map((customer: ITopCustomers) => {
      const formattedCustomer = { ...customer };
      formattedCustomer.customer_name = this.sanitizer.bypassSecurityTrustHtml(
        `<div class="d-flex">
                                          <img class="img-fluid img-40 rounded-circle me-2" src="${customer.customer_profile}" alt="user">
                                          <div class="img-content-box">
                                              <a class="f-w-500" href="javascript:void(0)" onclick="navigate()">
                                                ${customer.customer_name}
                                              </a>
                                              <p class="mb-0 f-light">${customer.customer_id}</p>
                                          </div>
                                        </div>`,
      );

      return formattedCustomer;
    });
  }
}
