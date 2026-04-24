import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { cardToggleOptions1 } from '../../../../../shared/data/common';
import { topPerformers } from '../../../../../shared/data/dashboard/crypto';
import { ITableConfigs } from '../../../../../shared/interface/common';
import { ITopPerformers } from '../../../../../shared/interface/dashboard/crypto';

@Component({
  selector: 'app-top-performers',
  imports: [Card, Table],
  templateUrl: './top-performers.html',
  styleUrl: './top-performers.scss',
})
export class TopPerformers {
  private sanitizer = inject(DomSanitizer);

  public cardToggleOption = cardToggleOptions1;
  public topPerformers = topPerformers;

  public tableConfig: ITableConfigs<ITopPerformers> = {
    columns: [
      { title: 'Cryptocurrency', field_value: 'currency_name', sort: true },
      { title: 'Total Market Cap', field_value: 'market_cap', sort: true },
      { title: 'USD', field_value: 'usd', sort: true },
      { title: 'ETH', field_value: 'eth', sort: true },
      { title: 'BTC', field_value: 'btc', sort: true },
      { title: 'Change (24h)', field_value: 'change24h', sort: true },
    ],
    data: [] as ITopPerformers[],
  };

  ngOnInit() {
    this.tableConfig.data = topPerformers.map(
      (topPerformers: ITopPerformers) => {
        const formattedPerformers = { ...topPerformers };

        const imageHTML = `<div class="d-flex align-items-center gap-2">
                           <div class="currency-icon ${topPerformers.bg_color}">
                              <svg>
                                    <use href="assets/svg/icon-sprite.svg#${topPerformers.currency_symbol}"></use>
                                 </svg>
                          </div>
                          <div>
                            <h6 class="f-14 mb-0 f-w-400">${topPerformers.currency_name}</h6>
                          </div>
                        </div>`;

        formattedPerformers.currency_name =
          this.sanitizer.bypassSecurityTrustHtml(imageHTML);

        return formattedPerformers;
      },
    );
  }
}
