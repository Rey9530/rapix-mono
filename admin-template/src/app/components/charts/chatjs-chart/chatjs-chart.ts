import { Component } from '@angular/core';

import { ChartJsBar } from './chart-js-bar/chart-js-bar';
import { ChartJsDoughnut } from './chart-js-doughnut/chart-js-doughnut';
import { ChartJsLine } from './chart-js-line/chart-js-line';
import { ChartJsLineChart } from './chart-js-line-chart/chart-js-line-chart';
import { ChartJsPolar } from './chart-js-polar/chart-js-polar';
import { ChartJsRadar } from './chart-js-radar/chart-js-radar';

@Component({
  selector: 'app-chatjs-chart',
  imports: [
    ChartJsBar,
    ChartJsLine,
    ChartJsRadar,
    ChartJsLineChart,
    ChartJsDoughnut,
    ChartJsPolar,
  ],
  templateUrl: './chatjs-chart.html',
  styleUrl: './chatjs-chart.scss',
})
export class ChatjsChart {}
