import { Component } from '@angular/core';

import { ChartistModule } from 'ng-chartist';

import { Card } from '../../../../shared/components/ui/card/card';
import { donutSVGChart } from '../../../../shared/data/charts/chartist-chart';

@Component({
  selector: 'app-donut-svg-animate',
  imports: [ChartistModule, Card],
  templateUrl: './donut-svg-animate.html',
  styleUrl: './donut-svg-animate.scss',
})
export class DonutSvgAnimate {
  public donutSVGChart = donutSVGChart;
}
