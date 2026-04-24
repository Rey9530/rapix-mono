import { Component } from '@angular/core';

import { ChartistModule } from 'ng-chartist';

import { Card } from '../../../../shared/components/ui/card/card';
import { filledHolesDataChart } from '../../../../shared/data/charts/chartist-chart';

@Component({
  selector: 'app-filled-holes-data',
  imports: [ChartistModule, Card],
  templateUrl: './filled-holes-data.html',
  styleUrl: './filled-holes-data.scss',
})
export class FilledHolesData {
  public filledHolesDataChart = filledHolesDataChart;
}
