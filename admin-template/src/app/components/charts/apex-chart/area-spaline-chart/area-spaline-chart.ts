import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../shared/components/ui/card/card';
import { areaSpalineChart } from '../../../../shared/data/charts/apex-chart';

@Component({
  selector: 'app-area-spaline-chart',
  imports: [NgApexchartsModule, Card],
  templateUrl: './area-spaline-chart.html',
  styleUrl: './area-spaline-chart.scss',
})
export class AreaSpalineChart {
  public areaSpalineChart = areaSpalineChart;
}
