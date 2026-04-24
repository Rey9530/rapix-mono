import { Component, inject } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { ActivityLog } from './widgets/activity-log/activity-log';
import { BuyAccount } from './widgets/buy-account/buy-account';
import { Details } from './widgets/details/details';
import { ManageAppointments } from './widgets/manage-appointments/manage-appointments';
import { MonthlyTarget } from './widgets/monthly-target/monthly-target';
import { RecentOrders } from './widgets/recent-orders/recent-orders';
import { SalesReport } from './widgets/sales-report/sales-report';
import { SalesStatistical } from './widgets/sales-statistical/sales-statistical';
import { TopCustomers } from './widgets/top-customers/top-customers';
import { VisitorsChart } from './widgets/visitors-chart/visitors-chart';
import { WelcomeCard } from './widgets/welcome-card/welcome-card';
import { details } from '../../../shared/data/dashboard/default';
import { IDetails } from '../../../shared/interface/dashboard/default';

@Component({
  selector: 'app-default',
  imports: [
    WelcomeCard,
    Details,
    VisitorsChart,
    TopCustomers,
    SalesStatistical,
    MonthlyTarget,
    ActivityLog,
    RecentOrders,
    BuyAccount,
    SalesReport,
    ManageAppointments,
  ],
  templateUrl: './default.html',
  styleUrl: './default.scss',
})
export class Default {
  private toast = inject(ToastrService);

  public details = details;
  public groupDetails: IDetails[][];

  constructor() {
    this.groupDetails = this.groupDetail(this.details, 2);
  }

  ngOnInit() {
    this.toast.show(
      '<i class="fa fa-bell"></i> <strong>Loading Inner Data........</strong>',
      '',
      {
        enableHtml: true,
        closeButton: true,
        progressBar: true,
        progressAnimation: 'increasing',
        timeOut: 5000,
      },
    );
  }

  groupDetail(details: IDetails[], groupSize: number) {
    const result = [];
    for (let i = 0; i < details.length; i += groupSize) {
      result.push(details.slice(i, i + groupSize));
    }
    return result;
  }
}
