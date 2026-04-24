import { Component } from '@angular/core';

import { ChartistModule } from 'ng-chartist';

import { Card } from '../../../../shared/components/ui/card/card';
import { lineAreaChart } from '../../../../shared/data/charts/chartist-chart';

@Component({
  selector: 'app-line-chart-area',
  imports: [ChartistModule, Card],
  templateUrl: './line-chart-area.html',
  styleUrl: './line-chart-area.scss',
})
export class LineChartArea {
  public lineAreaChart = lineAreaChart;
}
