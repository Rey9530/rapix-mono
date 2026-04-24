import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../shared/components/ui/card/card';
import { radialBarChart } from '../../../../shared/data/charts/apex-chart';

@Component({
  selector: 'app-radial-bar-chart',
  imports: [NgApexchartsModule, Card],
  templateUrl: './radial-bar-chart.html',
  styleUrl: './radial-bar-chart.scss',
})
export class RadialBarChart {
  public radialBarChart = radialBarChart;
}
