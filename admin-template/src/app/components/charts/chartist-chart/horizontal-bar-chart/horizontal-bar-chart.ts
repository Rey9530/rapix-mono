import { Component } from '@angular/core';

import { ChartistModule } from 'ng-chartist';

import { Card } from '../../../../shared/components/ui/card/card';
import { horizontalBarChart } from '../../../../shared/data/charts/chartist-chart';

@Component({
  selector: 'app-horizontal-bar-chart',
  imports: [ChartistModule, Card],
  templateUrl: './horizontal-bar-chart.html',
  styleUrl: './horizontal-bar-chart.scss',
})
export class HorizontalBarChart {
  public horizontalBarChart = horizontalBarChart;
}
