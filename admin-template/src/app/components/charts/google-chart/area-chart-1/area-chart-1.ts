import { Component } from '@angular/core';

import { Ng2GoogleChartsModule } from 'ng2-google-charts';

import { Card } from '../../../../shared/components/ui/card/card';
import { areaChart1 } from '../../../../shared/data/charts/google-chart';

@Component({
  selector: 'app-area-chart-1',
  imports: [Ng2GoogleChartsModule, Card],
  templateUrl: './area-chart-1.html',
  styleUrl: './area-chart-1.scss',
})
export class AreaChart1 {
  public areaChart1 = areaChart1;
}
