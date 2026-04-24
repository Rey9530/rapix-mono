import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions2 } from '../../../../../shared/data/common';
import { salesStatisticalChart } from '../../../../../shared/data/dashboard/default';

@Component({
  selector: 'app-sales-statistical',
  imports: [NgApexchartsModule, Card, DecimalPipe],
  templateUrl: './sales-statistical.html',
  styleUrl: './sales-statistical.scss',
})
export class SalesStatistical {
  public cardToggleOptions = cardToggleOptions2;
  public salesStatisticalChart = salesStatisticalChart;
}
