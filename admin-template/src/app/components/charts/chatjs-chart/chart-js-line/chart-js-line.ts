import { Component } from '@angular/core';

import { Colors, LineController, LineElement, PointElement } from 'chart.js';
import { BaseChartDirective, provideCharts } from 'ng2-charts';

import { Card } from '../../../../shared/components/ui/card/card';
import * as chartData from '../../../../shared/data/charts/chatjs-chart';

@Component({
  selector: 'app-chart-js-line',
  imports: [BaseChartDirective, Card],
  providers: [
    provideCharts({
      registerables: [LineController, PointElement, LineElement, Colors],
    }),
  ],
  templateUrl: './chart-js-line.html',
  styleUrl: './chart-js-line.scss',
})
export class ChartJsLine {
  public lineGraphOptions = chartData.lineGraphOptions;
  public lineGraphLabels = chartData.lineGraphLabels;
  public lineGraphType = chartData.lineGraphType;
  public lineGraphLegend = chartData.lineGraphLegend;
  public lineGraphData = chartData.lineGraphData;
}
