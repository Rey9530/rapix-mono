import { Component, input } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { CommonLineCharts } from '../../../../../shared/interface/widgets/chart';

@Component({
  selector: 'app-common-line-chart',
  imports: [NgApexchartsModule, Card],
  templateUrl: './common-line-chart.html',
  styleUrl: './common-line-chart.scss',
})
export class CommonLineChart {
  readonly chart_details = input<CommonLineCharts>();
}
