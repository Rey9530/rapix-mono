import { Component } from '@angular/core';

import { BaseChartDirective } from 'ng2-charts';

import { Card } from '../../../../shared/components/ui/card/card';
import * as chartData from '../../../../shared/data/charts/chatjs-chart';

@Component({
  selector: 'app-chart-js-line-chart',
  imports: [BaseChartDirective, Card],
  templateUrl: './chart-js-line-chart.html',
  styleUrl: './chart-js-line-chart.scss',
})
export class ChartJsLineChart {
  public lineChartOptions = chartData.lineChartOptions;
  public lineChartLabels = chartData.lineChartLabels;
  public lineChartType = chartData.lineChartType;
  public lineChartLegend = chartData.lineChartLegend;
  public lineChartData = chartData.lineChartData;
}
