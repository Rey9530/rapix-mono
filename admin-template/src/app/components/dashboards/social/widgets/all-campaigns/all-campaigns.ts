import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { cardToggleOptions8 } from '../../../../../shared/data/common';
import { campaigns } from '../../../../../shared/data/dashboard/social';
import { ITableConfigs } from '../../../../../shared/interface/common';
import { ICampaigns } from '../../../../../shared/interface/dashboard/social';

@Component({
  selector: 'app-all-campaigns',
  imports: [Card, Table],
  templateUrl: './all-campaigns.html',
  styleUrl: './all-campaigns.scss',
})
export class AllCampaigns {
  private sanitizer = inject(DomSanitizer);

  public cardToggleOption = cardToggleOptions8;

  public tableConfig: ITableConfigs<ICampaigns> = {
    columns: [
      { title: 'AD Platform', field_value: 'platform_name', sort: true },
      { title: 'Campaign', field_value: 'campaign', sort: true },
      { title: 'GEO', field_value: 'geo', sort: true },
      { title: 'Profitability', field_value: 'profitability', sort: true },
      { title: 'Impressions', field_value: 'impressions', sort: true },
      { title: 'Status', field_value: 'status', sort: true },
    ],
    row_action: [{ label: 'Create' }],
    data: [] as ICampaigns[],
  };

  ngOnInit() {
    this.tableConfig.data = campaigns.map((campaign: ICampaigns) => {
      const formattedCampaigns = { ...campaign };
      formattedCampaigns.platform_name = `<div class="${campaign.platform_name}">
                                          <div class="social-circle">
                                            <i class="fa-brands fa-${campaign.platform_logo}"></i></div>
                                        </div>`;

      const imageHtml = ` <div class="change-currency">
                        ${campaign.profitability}
                        </div>`;

      formattedCampaigns.profitability =
        this.sanitizer.bypassSecurityTrustHtml(imageHtml);

      const statusHTML = `<button class="btn badge-light-${campaign.status == 'Active' ? 'primary' : 'light'}">${campaign.status}</button>`;

      formattedCampaigns.status =
        this.sanitizer.bypassSecurityTrustHtml(statusHTML);

      return formattedCampaigns;
    });
  }
}
