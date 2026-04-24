import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { cardToggleOptions1 } from '../../../../../shared/data/common';
import { averageSalePrice } from '../../../../../shared/data/dashboard/crypto';
import { ITableConfigs } from '../../../../../shared/interface/common';
import { IAverageSalePrice } from '../../../../../shared/interface/dashboard/crypto';

@Component({
  selector: 'app-average-sale-price',
  imports: [Card, Table],
  templateUrl: './average-sale-price.html',
  styleUrl: './average-sale-price.scss',
})
export class AverageSalePrice {
  private sanitizer = inject(DomSanitizer);

  public cardToggleOption = cardToggleOptions1;
  public averageSalePrice = averageSalePrice;

  public tableConfig: ITableConfigs<IAverageSalePrice> = {
    columns: [
      { title: 'Cryptocurrency', field_value: 'currency_name', sort: true },
      { title: 'USD', field_value: 'usd', sort: true },
      { title: 'ETH', field_value: 'eth', sort: true },
      { title: 'BTC', field_value: 'btc', sort: true },
      { title: 'Price Change(%)', field_value: 'price_change', sort: true },
    ],
    data: [] as IAverageSalePrice[],
  };

  ngOnInit() {
    this.tableConfig.data = averageSalePrice.map((sale: IAverageSalePrice) => {
      const formattedSale = { ...sale };

      const imageHTML = ` <div class="d-flex align-items-center gap-2">
                      <div class="currency-icon ${sale.bg_color}">
                        <svg>
                          <use href="assets/svg/icon-sprite.svg#${sale.currency_symbol}"></use>
                        </svg>
                      </div>
                      <div> 
                        <h6 class="f-14 mb-0 f-w-400">${sale.currency_name}</h6>
                      </div>
                    </div>`;

      formattedSale.currency_name =
        this.sanitizer.bypassSecurityTrustHtml(imageHTML);

      return formattedSale;
    });
  }
}
