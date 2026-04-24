import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../shared/components/ui/card/card';
import { barChart } from '../../../../shared/data/charts/apex-chart';

@Component({
  selector: 'app-bar-chart',
  imports: [NgApexchartsModule, Card],
  templateUrl: './bar-chart.html',
  styleUrl: './bar-chart.scss',
})
export class BarChart {
  public barChart = barChart;
}
