import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { leads } from '../../../../../shared/data/dashboard/crm';
import { ITableConfigs } from '../../../../../shared/interface/common';
import { ILead } from '../../../../../shared/interface/dashboard/crm';

@Component({
  selector: 'app-leads',
  imports: [Card, Table],
  templateUrl: './leads.html',
  styleUrl: './leads.scss',
})
export class Leads {
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  public tableConfig: ITableConfigs<ILead> = {
    columns: [
      { title: 'Lead Name', field_value: 'lead_name', sort: true },
      { title: 'Date', field_value: 'date', sort: true },
      { title: 'Email', field_value: 'email', sort: true },
      { title: 'Assigned to', field_value: 'assign_user_name', sort: true },
      { title: 'Status', field_value: 'status', sort: true },
    ],
    data: [] as ILead[],
  };

  ngOnInit() {
    window.navigate = () => {
      void this.router.navigate(['/user/user-list']);
    };

    this.tableConfig.data = leads.map((lead: ILead) => {
      const formattedLead = { ...lead };
      formattedLead.lead_name = this.sanitizer
        .bypassSecurityTrustHtml(`<div class="common-flex align-items-center">
                                  <img class="img-fluid lead-img" src="${lead.lead_profile}" alt="${lead.lead_name}">
                                  <a class="c-light" href="javascript:void(0)" onclick="navigate()">${lead.lead_name}</a>
                                </div>`);

      formattedLead.assign_user_name = this.sanitizer
        .bypassSecurityTrustHtml(`<div class="common-flex align-items-center">
                                          <img class="img-fluid" src="${lead.assign_user_profile}" alt="${lead.assign_user_name}">
                                          <a class="c-light" href="javascript:void(0)" onclick="navigate()">${lead.assign_user_name}</a>
                                        </div>`);

      let buttonHTML = `<button class="btn button-light-${
        lead.status == 'Accepted'
          ? 'success'
          : lead.status == 'Pending'
            ? 'warning'
            : lead.status == 'Rejected'
              ? 'danger'
              : ''
      } txt-${
        lead.status == 'Accepted'
          ? 'success'
          : lead.status == 'Pending'
            ? 'warning'
            : lead.status == 'Rejected'
              ? 'danger'
              : ''
      } f-w-500">${lead.status}</button>`;

      formattedLead.status = this.sanitizer.bypassSecurityTrustHtml(buttonHTML);

      return formattedLead;
    });
  }
}
