import { Component } from '@angular/core';

import { Ng2GoogleChartsModule } from 'ng2-google-charts';

import { Card } from '../../../../shared/components/ui/card/card';
import { pieChart1 } from '../../../../shared/data/charts/google-chart';

@Component({
  selector: 'app-pie-chart-1',
  imports: [Ng2GoogleChartsModule, Card],
  templateUrl: './pie-chart-1.html',
  styleUrl: './pie-chart-1.scss',
})
export class PieChart1 {
  public pieChart1 = pieChart1;
}
