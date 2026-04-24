import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { referralsVisit } from '../../../../../shared/data/dashboard/analytics';
import { ITableConfigs } from '../../../../../shared/interface/common';
import { IReferralsVisit } from '../../../../../shared/interface/dashboard/analytics';

@Component({
  selector: 'app-referrals-visit',
  imports: [Table, Card],
  templateUrl: './referrals-visit.html',
  styleUrl: './referrals-visit.scss',
})
export class ReferralsVisit {
  private sanitizer = inject(DomSanitizer);

  public referralsVisit = referralsVisit;
  public cardToggleOption = cardToggleOptions3;

  public tableConfig: ITableConfigs<IReferralsVisit> = {
    columns: [
      { title: 'Social Network', field_value: 'social_network' },
      { title: 'Conversion Rate', field_value: 'conversion_rate' },
      { title: 'Visits', field_value: 'visits' },
    ],
    data: [] as IReferralsVisit[],
  };

  ngOnInit() {
    this.tableConfig.data = referralsVisit.map((details: IReferralsVisit) => {
      const formattedDetails = { ...details };
      const networkHTML = `<div class="referral-wrapper">
                            <div>
                              <div class="border-${details.icon_class}">   
                                <div class="social-wrapper bg-light-${
                                  details.icon_class ? details.icon_class : ''
                                }">
                                <svg class="stroke-icon">
                                    <use href="assets/svg/icon-sprite.svg#${
                                      details.icon
                                    }"></use>
                                  </svg>
                                </div>
                              </div>
                              <span class="f-w-500">${
                                details.social_network
                              }</span>
                            </div>
                          </div>`;

      formattedDetails.social_network =
        this.sanitizer.bypassSecurityTrustHtml(networkHTML);

      const rateHTML = `<button class="btn button-light-${details.class} f-w-500 txt-${details.class}">${details.conversion_rate}</button>`;

      formattedDetails.conversion_rate =
        this.sanitizer.bypassSecurityTrustHtml(rateHTML);

      return formattedDetails;
    });
  }
}
