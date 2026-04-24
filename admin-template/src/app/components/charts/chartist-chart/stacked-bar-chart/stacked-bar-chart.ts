import { Component } from '@angular/core';

import { ChartistModule } from 'ng-chartist';

import { Card } from '../../../../shared/components/ui/card/card';
import { stackedBarChart } from '../../../../shared/data/charts/chartist-chart';

@Component({
  selector: 'app-stacked-bar-chart',
  imports: [ChartistModule, Card],
  templateUrl: './stacked-bar-chart.html',
  styleUrl: './stacked-bar-chart.scss',
})
export class StackedBarChart {
  public stackedBarChart = stackedBarChart;
}
