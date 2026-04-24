import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { estimatedActualChart } from '../../../../../shared/data/dashboard/projects';

@Component({
  selector: 'app-estimated-actual-chart',
  imports: [NgApexchartsModule, Card],
  templateUrl: './estimated-actual-chart.html',
  styleUrl: './estimated-actual-chart.scss',
})
export class EstimatedActualChart {
  public cardToggleOption = cardToggleOptions3;
  public estimatedActualChart = estimatedActualChart;
}
