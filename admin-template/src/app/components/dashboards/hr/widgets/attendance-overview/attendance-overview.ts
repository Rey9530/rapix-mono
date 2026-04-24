import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { attendanceOverview } from '../../../../../shared/data/dashboard/hr';
import { ITableConfigs } from '../../../../../shared/interface/common';
import { IAttendanceOverview } from '../../../../../shared/interface/dashboard/hr';

@Component({
  selector: 'app-attendance-overview',
  imports: [Table, Card],
  templateUrl: './attendance-overview.html',
  styleUrl: './attendance-overview.scss',
})
export class AttendanceOverview {
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  public attendanceOverview = attendanceOverview;
  public cardToggleOption = cardToggleOptions3;

  public tableConfig: ITableConfigs<IAttendanceOverview> = {
    columns: [
      { title: 'Employee Name', field_value: 'employee_name', sort: true },
      { title: 'Designation', field_value: 'designation', sort: true },
      { title: 'Check In Time', field_value: 'check_in_time', sort: true },
      { title: 'Status', field_value: 'status', sort: true },
    ],

    data: [] as IAttendanceOverview[],
  };

  ngOnInit() {
    window.navigate = () => {
      void this.router.navigate(['/user/user-list']);
    };

    this.tableConfig.data = attendanceOverview.map(
      (details: IAttendanceOverview) => {
        const formattedDetails = { ...details };

        formattedDetails.employee_name = this.sanitizer.bypassSecurityTrustHtml(
          `<a class="f-w-500" href="javascript:void(0)"  onclick="navigate()">${details.employee_name}</a>`,
        );

        formattedDetails.status = `<span class="badge badge-light-${details.class}">${details.status}</span>`;

        return formattedDetails;
      },
    );
  }
}
