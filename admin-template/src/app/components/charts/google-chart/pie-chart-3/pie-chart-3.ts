import { Component } from '@angular/core';

import { Ng2GoogleChartsModule } from 'ng2-google-charts';

import { Card } from '../../../../shared/components/ui/card/card';
import { pieChart3 } from '../../../../shared/data/charts/google-chart';

@Component({
  selector: 'app-pie-chart-3',
  imports: [Ng2GoogleChartsModule, Card],
  templateUrl: './pie-chart-3.html',
  styleUrl: './pie-chart-3.scss',
})
export class PieChart3 {
  public pieChart3 = pieChart3;
}
