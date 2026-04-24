import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../shared/components/ui/card/card';
import { pieChart } from '../../../../shared/data/charts/apex-chart';

@Component({
  selector: 'app-pie-chart',
  imports: [NgApexchartsModule, Card],
  templateUrl: './pie-chart.html',
  styleUrl: './pie-chart.scss',
})
export class PieChart {
  public pieChart = pieChart;
}
