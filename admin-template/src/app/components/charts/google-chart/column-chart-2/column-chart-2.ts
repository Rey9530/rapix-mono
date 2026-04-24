import { Component } from '@angular/core';

import { Ng2GoogleChartsModule } from 'ng2-google-charts';

import { Card } from '../../../../shared/components/ui/card/card';
import { columnChart2 } from '../../../../shared/data/charts/google-chart';

@Component({
  selector: 'app-column-chart-2',
  imports: [Card, Ng2GoogleChartsModule],
  templateUrl: './column-chart-2.html',
  styleUrl: './column-chart-2.scss',
})
export class ColumnChart2 {
  public columnChart2 = columnChart2;
}
