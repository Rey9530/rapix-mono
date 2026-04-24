import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../shared/components/ui/card/card';
import { radarChart } from '../../../../shared/data/charts/apex-chart';

@Component({
  selector: 'app-radar-chart',
  imports: [NgApexchartsModule, Card],
  templateUrl: './radar-chart.html',
  styleUrl: './radar-chart.scss',
})
export class RadarChart {
  public radarChart = radarChart;
}
