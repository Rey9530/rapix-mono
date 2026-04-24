import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions1 } from '../../../../../shared/data/common';
import { visitorChart } from '../../../../../shared/data/dashboard/default';

@Component({
  selector: 'app-visitors-chart',
  imports: [NgApexchartsModule, Card],
  templateUrl: './visitors-chart.html',
  styleUrl: './visitors-chart.scss',
})
export class VisitorsChart {
  public cardToggleOptions = cardToggleOptions1;
  public visitorChart = visitorChart;
}
