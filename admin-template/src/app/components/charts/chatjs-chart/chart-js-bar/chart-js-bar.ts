import { Component } from '@angular/core';

import {
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { BaseChartDirective, provideCharts } from 'ng2-charts';

import { Card } from '../../../../shared/components/ui/card/card';
import { barChart } from '../../../../shared/data/charts/chatjs-chart';

@Component({
  selector: 'app-chart-js-bar',
  imports: [BaseChartDirective, Card],
  providers: [
    provideCharts({
      registerables: [BarController, CategoryScale, LinearScale, BarElement],
    }),
  ],
  templateUrl: './chart-js-bar.html',
  styleUrl: './chart-js-bar.scss',
})
export class ChartJsBar {
  public barChart = barChart;
}
