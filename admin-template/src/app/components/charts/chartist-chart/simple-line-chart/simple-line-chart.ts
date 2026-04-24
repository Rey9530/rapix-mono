import { Component } from '@angular/core';

import { ChartistModule } from 'ng-chartist';

import { Card } from '../../../../shared/components/ui/card/card';
import { simpleLineChart } from '../../../../shared/data/charts/chartist-chart';

@Component({
  selector: 'app-simple-line-chart',
  imports: [ChartistModule, Card],
  templateUrl: './simple-line-chart.html',
  styleUrl: './simple-line-chart.scss',
})
export class SimpleLineChart {
  public simpleLineChart = simpleLineChart;
}
