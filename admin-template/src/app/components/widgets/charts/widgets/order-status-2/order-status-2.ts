import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { orderStatusChart2 } from '../../../../../shared/data/widgets/chart';

@Component({
  selector: 'app-order-status-2',
  imports: [NgApexchartsModule, Card],
  templateUrl: './order-status-2.html',
  styleUrl: './order-status-2.scss',
})
export class OrderStatus2 {
  public orderStatusChart2 = orderStatusChart2;
}
