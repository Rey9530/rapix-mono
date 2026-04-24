import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { cardToggleOptions2 } from '../../../../../shared/data/common';
import { pageAnalytics } from '../../../../../shared/data/dashboard/analytics';
import { ITableConfigs } from '../../../../../shared/interface/common';
import { IPageAnalytics } from '../../../../../shared/interface/dashboard/analytics';

@Component({
  selector: 'app-page-analytics',
  imports: [Table, Card],
  templateUrl: './page-analytics.html',
  styleUrl: './page-analytics.scss',
})
export class PageAnalytics {
  public pageAnalytics = pageAnalytics;
  public cardToggleOption = cardToggleOptions2;

  public tableConfig: ITableConfigs<IPageAnalytics> = {
    columns: [
      { title: 'Page Name', field_value: 'page_name', sort: true },
      { title: 'Page Views', field_value: 'page_views', sort: true },
      { title: 'Bounce Rate', field_value: 'bounce_rate', sort: true },
      { title: 'Click Rate', field_value: 'click_rate', sort: true },
      { title: 'Devices', field_value: 'devices', sort: true },
    ],
    data: [] as IPageAnalytics[],
  };

  ngOnInit() {
    this.tableConfig.data = pageAnalytics.map((details: IPageAnalytics) => {
      const formattedDetails = { ...details };
      formattedDetails.page_views = ` <div class="change-currency"> 
                                        ${details.page_views}
                                        </div>`;
      formattedDetails.bounce_rate = ` <div class="change-currency"> 
                                        ${details.bounce_rate}
                                        </div>`;
      formattedDetails.click_rate = `<div class="change-currency">
                                      ${details.click_rate}
                                      </div>`;
      return formattedDetails;
    });
  }
}
