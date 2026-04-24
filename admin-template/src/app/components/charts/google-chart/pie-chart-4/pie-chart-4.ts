import { Component } from '@angular/core';

import { Ng2GoogleChartsModule } from 'ng2-google-charts';

import { Card } from '../../../../shared/components/ui/card/card';
import { pieChart4 } from '../../../../shared/data/charts/google-chart';

@Component({
  selector: 'app-pie-chart-4',
  imports: [Ng2GoogleChartsModule, Card],
  templateUrl: './pie-chart-4.html',
  styleUrl: './pie-chart-4.scss',
})
export class PieChart4 {
  public pieChart4 = pieChart4;
}
