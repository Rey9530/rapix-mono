import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions1 } from '../../../../../shared/data/common';
import { salesReportChart } from '../../../../../shared/data/dashboard/default';

@Component({
  selector: 'app-sales-report',
  imports: [NgApexchartsModule, Card],
  templateUrl: './sales-report.html',
  styleUrl: './sales-report.scss',
})
export class SalesReport {
  public cardToggleOptions = cardToggleOptions1;
  public salesReportChart = salesReportChart;
}
