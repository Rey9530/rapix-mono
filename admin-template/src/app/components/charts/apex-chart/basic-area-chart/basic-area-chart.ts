import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../shared/components/ui/card/card';
import { basicChart } from '../../../../shared/data/charts/apex-chart';

@Component({
  selector: 'app-basic-area-chart',
  imports: [NgApexchartsModule, Card],
  templateUrl: './basic-area-chart.html',
  styleUrl: './basic-area-chart.scss',
})
export class BasicAreaChart {
  public basicChart = basicChart;
}
