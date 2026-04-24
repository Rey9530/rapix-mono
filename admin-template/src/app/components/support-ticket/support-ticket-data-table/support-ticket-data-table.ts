import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Table } from '../../../shared/components/ui/table/table';
import { supportDataTable } from '../../../shared/data/support-ticket';
import { ITableConfigs } from '../../../shared/interface/common';
import { ISupportDB } from '../../../shared/interface/support-ticket';

@Component({
  selector: 'app-support-ticket-data-table',
  imports: [Table],
  templateUrl: './support-ticket-data-table.html',
  styleUrl: './support-ticket-data-table.scss',
})
export class SupportTicketDataTable {
  private sanitizer = inject(DomSanitizer);

  public supportDataTable = supportDataTable;
  public selected: number[] = [];

  public tableConfig: ITableConfigs<ISupportDB> = {
    columns: [
      { title: 'Name', field_value: 'name', sort: true },
      { title: 'Position', field_value: 'position', sort: true },
      { title: 'Salary', field_value: 'salary', sort: true, type: 'price' },
      { title: 'Office', field_value: 'office', sort: true },
      { title: 'Skill', field_value: 'progress', sort: true },
      { title: 'Extn', field_value: 'extn', sort: true },
      { title: 'E-mail', field_value: 'email', sort: true },
    ],
    data: [] as ISupportDB[],
  };

  ngOnInit() {
    this.tableConfig.data = this.formatSupport(supportDataTable);
  }

  private formatSupport(supportDataTable: ISupportDB[]) {
    return supportDataTable.map((users: ISupportDB) => {
      const formattedSupport = { ...users };
      formattedSupport.name = ` <div class="d-flex">
                                <img class="rounded-circle img-30 me-3" src="${users.img}" alt="Generic placeholder image">
                                <div class="flex-grow-1 align-self-center">
                                  <div>${users.name}</div>
                                </div>
                              </div>`;

      const html = `<div class="progress-showcase">
                              <div class="progress sm-progress-bar">
                                <div class="progress-bar bg-${users.skill}" 
                                     role="progressbar" 
                                     style="width: ${users.progress}" 
                                     aria-valuenow="${users.progress}" 
                                     aria-valuemin="0" 
                                     aria-valuemax="100">
                                </div>
                              </div>
                            </div>`;

      formattedSupport.progress = this.sanitizer.bypassSecurityTrustHtml(html);

      return formattedSupport;
    });
  }
}
