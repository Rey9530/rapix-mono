import { Component } from '@angular/core';

import { Ng2GoogleChartsModule } from 'ng2-google-charts';

import { Card } from '../../../../shared/components/ui/card/card';
import { comboChart } from '../../../../shared/data/charts/google-chart';

@Component({
  selector: 'app-combo-chart',
  imports: [Ng2GoogleChartsModule, Card],
  templateUrl: './combo-chart.html',
  styleUrl: './combo-chart.scss',
})
export class ComboChart {
  public comboChart = comboChart;
}
