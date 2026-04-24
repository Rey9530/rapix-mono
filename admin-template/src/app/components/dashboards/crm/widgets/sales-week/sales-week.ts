import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { salesWeekChart } from '../../../../../shared/data/dashboard/crm';

@Component({
  selector: 'app-sales-week',
  imports: [NgApexchartsModule],
  templateUrl: './sales-week.html',
  styleUrl: './sales-week.scss',
})
export class SalesWeek {
  public salesWeekChart = salesWeekChart;
}
