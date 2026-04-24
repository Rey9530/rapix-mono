import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { monthOrderChart } from '../../../../../shared/data/dashboard/e-commerce';

@Component({
  selector: 'app-month-order',
  imports: [NgApexchartsModule, Card, DecimalPipe],
  templateUrl: './month-order.html',
  styleUrl: './month-order.scss',
})
export class MonthOrder {
  public cardToggleOption = cardToggleOptions3;
  public orderChart = monthOrderChart;
}
