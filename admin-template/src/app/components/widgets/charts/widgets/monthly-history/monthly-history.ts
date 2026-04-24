import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { monthlyHistoryChart } from '../../../../../shared/data/widgets/chart';

@Component({
  selector: 'app-monthly-history',
  imports: [NgApexchartsModule, Card],
  templateUrl: './monthly-history.html',
  styleUrl: './monthly-history.scss',
})
export class MonthlyHistory {
  public monthlyHistoryChart = monthlyHistoryChart;
}
