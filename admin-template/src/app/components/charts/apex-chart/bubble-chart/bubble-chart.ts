import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../shared/components/ui/card/card';
import { bubbleChart } from '../../../../shared/data/charts/apex-chart';

@Component({
  selector: 'app-bubble-chart',
  imports: [NgApexchartsModule, Card],
  templateUrl: './bubble-chart.html',
  styleUrl: './bubble-chart.scss',
})
export class BubbleChart {
  public bubbleChart = bubbleChart;
}
