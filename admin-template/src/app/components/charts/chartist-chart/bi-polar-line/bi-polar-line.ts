import { Component } from '@angular/core';

import { ChartistModule } from 'ng-chartist';

import { Card } from '../../../../shared/components/ui/card/card';
import { biPolarLineChart } from '../../../../shared/data/charts/chartist-chart';

@Component({
  selector: 'app-bi-polar-line',
  imports: [ChartistModule, Card],
  templateUrl: './bi-polar-line.html',
  styleUrl: './bi-polar-line.scss',
})
export class BiPolarLine {
  public biPolarLineChart = biPolarLineChart;
}
