import { Component } from '@angular/core';

import { ChartistModule } from 'ng-chartist';

import { Card } from '../../../../shared/components/ui/card/card';
import { biPolarBarChart } from '../../../../shared/data/charts/chartist-chart';

@Component({
  selector: 'app-bi-polar-bar-chart',
  imports: [ChartistModule, Card],
  templateUrl: './bi-polar-bar-chart.html',
  styleUrl: './bi-polar-bar-chart.scss',
})
export class BiPolarBarChart {
  public biPolarBarChart = biPolarBarChart;
}
