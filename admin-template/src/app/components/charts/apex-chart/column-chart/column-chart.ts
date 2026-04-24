import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../shared/components/ui/card/card';
import { columnChart } from '../../../../shared/data/charts/apex-chart';

@Component({
  selector: 'app-column-chart',
  imports: [NgApexchartsModule, Card],
  templateUrl: './column-chart.html',
  styleUrl: './column-chart.scss',
})
export class ColumnChart {
  public columnChart = columnChart;
}
