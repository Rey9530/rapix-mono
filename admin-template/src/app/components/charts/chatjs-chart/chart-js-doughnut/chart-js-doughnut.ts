import { Component } from '@angular/core';

import { ArcElement, DoughnutController } from 'chart.js';
import { BaseChartDirective, provideCharts } from 'ng2-charts';

import { Card } from '../../../../shared/components/ui/card/card';
import * as chartData from '../../../../shared/data/charts/chatjs-chart';

@Component({
  selector: 'app-chart-js-doughnut',
  imports: [BaseChartDirective, Card],
  providers: [
    provideCharts({ registerables: [DoughnutController, ArcElement] }),
  ],
  templateUrl: './chart-js-doughnut.html',
  styleUrl: './chart-js-doughnut.scss',
})
export class ChartJsDoughnut {
  public doughnutChartLabels = chartData.doughnutChartLabels;
  public doughnutChartData = chartData.doughnutChartData;
  public doughnutChartType = chartData.doughnutChartType;
  public doughnutChartColors = chartData.doughnutChartOptions;
  public doughnutChartOptions = chartData.doughnutChartOptions;
  public doughnutChartLegend = chartData.doughnutChartLegend;
}
