import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { myCurrency } from '../../../../../shared/data/dashboard/crypto';
import { ITableConfigs } from '../../../../../shared/interface/common';
import { IMyCurrency } from '../../../../../shared/interface/dashboard/crypto';

@Component({
  selector: 'app-my-currency',
  imports: [Card, Table],
  templateUrl: './my-currency.html',
  styleUrl: './my-currency.scss',
})
export class MyCurrency {
  private sanitizer = inject(DomSanitizer);

  public tableConfig: ITableConfigs<IMyCurrency> = {
    columns: [
      {
        title: 'Coin Name',
        field_value: 'currency_name',
        sort: true,
      },
      { title: 'Price', field_value: 'price', sort: true, type: 'price' },
      {
        title: '24h Change',
        field_value: 'day_change',
        sort: true,
      },
      {
        title: 'Total Balance',
        field_value: 'total_balance',
        sort: true,
        type: 'price',
      },
      { title: 'Total Coin', field_value: 'total_coin', sort: true },
      { title: 'Action', field_value: 'is_trade', sort: true },
    ],

    data: [] as IMyCurrency[],
  };

  ngOnInit() {
    this.tableConfig.data = myCurrency.map((currency: IMyCurrency) => {
      const formattedCurrency = { ...currency };

      const imageHTML = `<div class="d-flex align-items-center gap-2">
                                <div class="currency-icon ${currency.color}">
                                  <svg>
                                  <use href="assets/svg/icon-sprite.svg#${currency.currency_symbol}"></use>
                                  </svg>
                                </div>
                                <div>
                                  <h6 class="f-14 mb-0 f-w-400">${currency.currency_name}</h6>
                                </div>
                              </div>`;

      formattedCurrency.currency_name =
        this.sanitizer.bypassSecurityTrustHtml(imageHTML);

      formattedCurrency.day_change = `<div class="change-currency font-success"> 
                                       ${currency.day_change}
                                        </div>`;

      const buttonHTML = `<button class="btn button-primary">Trade</button>`;

      formattedCurrency.is_trade =
        this.sanitizer.bypassSecurityTrustHtml(buttonHTML);

      return formattedCurrency;
    });
  }
}
