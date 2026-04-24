import { Component } from '@angular/core';

import { Ng2GoogleChartsModule } from 'ng2-google-charts';

import { Card } from '../../../../shared/components/ui/card/card';
import { pieChart2 } from '../../../../shared/data/charts/google-chart';

@Component({
  selector: 'app-pie-chart-2',
  imports: [Ng2GoogleChartsModule, Card],
  templateUrl: './pie-chart-2.html',
  styleUrl: './pie-chart-2.scss',
})
export class PieChart2 {
  public pieChart2 = pieChart2;
}
