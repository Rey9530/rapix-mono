import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../shared/components/ui/card/card';
import { donutChart } from '../../../../shared/data/charts/apex-chart';

@Component({
  selector: 'app-donut-chart',
  imports: [NgApexchartsModule, Card],
  templateUrl: './donut-chart.html',
  styleUrl: './donut-chart.scss',
})
export class DonutChart {
  public donutChart = donutChart;
}
