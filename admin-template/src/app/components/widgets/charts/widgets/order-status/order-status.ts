import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions1 } from '../../../../../shared/data/common';
import { orderStatusChart } from '../../../../../shared/data/widgets/chart';

@Component({
  selector: 'app-order-status',
  imports: [NgApexchartsModule, Card],
  templateUrl: './order-status.html',
  styleUrl: './order-status.scss',
})
export class OrderStatus {
  public orderStatusChart = orderStatusChart;
  public cardToggleOption = cardToggleOptions1;
}
