import { Component } from '@angular/core';

import { Ng2GoogleChartsModule } from 'ng2-google-charts';

import { Card } from '../../../../shared/components/ui/card/card';
import { barChart } from '../../../../shared/data/charts/google-chart';

@Component({
  selector: 'app-bar-chart-2',
  imports: [Ng2GoogleChartsModule, Card],
  templateUrl: './bar-chart-2.html',
  styleUrl: './bar-chart-2.scss',
})
export class BarChart2 {
  public barChart = barChart;
}
