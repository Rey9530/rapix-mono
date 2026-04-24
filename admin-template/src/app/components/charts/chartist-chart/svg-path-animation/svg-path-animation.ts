import { Component } from '@angular/core';

import { ChartistModule } from 'ng-chartist';

import { Card } from '../../../../shared/components/ui/card/card';
import { svgPathChart } from '../../../../shared/data/charts/chartist-chart';

@Component({
  selector: 'app-svg-path-animation',
  imports: [ChartistModule, Card],
  templateUrl: './svg-path-animation.html',
  styleUrl: './svg-path-animation.scss',
})
export class SvgPathAnimation {
  public svgPathChart = svgPathChart;
}
