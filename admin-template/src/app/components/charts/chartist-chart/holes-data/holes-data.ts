import { Component } from '@angular/core';

import { ChartistModule } from 'ng-chartist';

import { Card } from '../../../../shared/components/ui/card/card';
import { holesDataChart } from '../../../../shared/data/charts/chartist-chart';

@Component({
  selector: 'app-holes-data',
  imports: [ChartistModule, Card],
  templateUrl: './holes-data.html',
  styleUrl: './holes-data.scss',
})
export class HolesData {
  public holesDataChart = holesDataChart;
}
