import { Component } from '@angular/core';

import { ChartistModule } from 'ng-chartist';

import { Card } from '../../../../shared/components/ui/card/card';
import { extremeResponsiveChart } from '../../../../shared/data/charts/chartist-chart';

@Component({
  selector: 'app-extreme-responsive',
  imports: [ChartistModule, Card],
  templateUrl: './extreme-responsive.html',
  styleUrl: './extreme-responsive.scss',
})
export class ExtremeResponsive {
  public extremeResponsiveChart = extremeResponsiveChart;
}
