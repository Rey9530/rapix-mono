import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../shared/components/ui/card/card';
import { mixChart } from '../../../../shared/data/charts/apex-chart';

@Component({
  selector: 'app-mixed-chart',
  imports: [NgApexchartsModule, Card],
  templateUrl: './mixed-chart.html',
  styleUrl: './mixed-chart.scss',
})
export class MixedChart {
  public mixChart = mixChart;
}
