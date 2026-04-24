import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { upcomingDeadline } from '../../../../../shared/data/dashboard/projects';
import { ITableConfigs } from '../../../../../shared/interface/common';
import { IUpcomingDeadline } from '../../../../../shared/interface/dashboard/projects';

@Component({
  selector: 'app-upcoming-deadline',
  imports: [Card, Table],
  templateUrl: './upcoming-deadline.html',
  styleUrl: './upcoming-deadline.scss',
})
export class UpcomingDeadline {
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  public cardToggleOption = cardToggleOptions3;
  public upcomingDeadline = upcomingDeadline;

  public tableConfig: ITableConfigs<IUpcomingDeadline> = {
    columns: [
      { title: 'Employee', field_value: 'employee', sort: true },
      { title: 'Task', field_value: 'task', sort: true },
      { title: 'Deadline', field_value: 'deadline', sort: true },
    ],

    data: [] as IUpcomingDeadline[],
  };

  ngOnInit() {
    window.navigate = () => {
      void this.router.navigate(['/task']);
    };

    this.tableConfig.data = upcomingDeadline.map(
      (details: IUpcomingDeadline) => {
        const formattedDetails = { ...details };
        formattedDetails.employee = this.sanitizer.bypassSecurityTrustHtml(
          `<a class="f-w-500" href="javascript:void(0)" onclick="navigate()">${details.employee}</a>`,
        );

        return formattedDetails;
      },
    );
  }
}
