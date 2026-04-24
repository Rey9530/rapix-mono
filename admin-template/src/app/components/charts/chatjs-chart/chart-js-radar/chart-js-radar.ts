import { Component } from '@angular/core';

import { RadarController, RadialLinearScale } from 'chart.js';
import { BaseChartDirective, provideCharts } from 'ng2-charts';

import { Card } from '../../../../shared/components/ui/card/card';
import * as chartData from '../../../../shared/data/charts/chatjs-chart';

@Component({
  selector: 'app-chart-js-radar',
  imports: [BaseChartDirective, Card],
  providers: [
    provideCharts({ registerables: [RadarController, RadialLinearScale] }),
  ],
  templateUrl: './chart-js-radar.html',
  styleUrl: './chart-js-radar.scss',
})
export class ChartJsRadar {
  public radarGraphOptions = chartData.radarGraphOptions;
  public radarGraphLabels = chartData.radarGraphLabels;
  public radarGraphType = chartData.radarGraphType;
  public radarGraphData = chartData.radarGraphData;
}
