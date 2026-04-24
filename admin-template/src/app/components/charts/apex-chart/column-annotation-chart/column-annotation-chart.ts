import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../shared/components/ui/card/card';
import { columnChart2 } from '../../../../shared/data/charts/apex-chart';

@Component({
  selector: 'app-column-annotation-chart',
  imports: [NgApexchartsModule, Card],
  templateUrl: './column-annotation-chart.html',
  styleUrl: './column-annotation-chart.scss',
})
export class ColumnAnnotationChart {
  public columnChart = columnChart2;
}
