import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../shared/components/ui/card/card';
import { stepLineChart } from '../../../../shared/data/charts/apex-chart';

@Component({
  selector: 'app-stepline-chart',
  imports: [NgApexchartsModule, Card],
  templateUrl: './stepline-chart.html',
  styleUrl: './stepline-chart.scss',
})
export class SteplineChart {
  public stepLineChart = stepLineChart;
}
