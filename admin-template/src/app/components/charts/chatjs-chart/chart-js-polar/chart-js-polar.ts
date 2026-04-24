import { Component } from '@angular/core';

import { PolarAreaController } from 'chart.js';
import { BaseChartDirective, provideCharts } from 'ng2-charts';

import { Card } from '../../../../shared/components/ui/card/card';
import * as chartData from '../../../../shared/data/charts/chatjs-chart';

@Component({
  selector: 'app-chart-js-polar',
  imports: [BaseChartDirective, Card],
  providers: [provideCharts({ registerables: [PolarAreaController] })],
  templateUrl: './chart-js-polar.html',
  styleUrl: './chart-js-polar.scss',
})
export class ChartJsPolar {
  public polarChartLabels = chartData.polarChartLabels;
  public polarChartData = chartData.polarChartData;
  public polarChartType = chartData.polarChartType;
  public polarChartColors = chartData.polarChartColors;
  public polarChartOptions = chartData.polarChartOptions;
  public polarChartLegend = chartData.polarChartLegend;
}
