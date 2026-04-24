import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../shared/components/ui/card/card';
import { candleStickChart } from '../../../../shared/data/charts/apex-chart';

@Component({
  selector: 'app-candlestick-chart',
  imports: [NgApexchartsModule, Card],
  templateUrl: './candlestick-chart.html',
  styleUrl: './candlestick-chart.scss',
})
export class CandlestickChart {
  public candleStickChart = candleStickChart;
}
