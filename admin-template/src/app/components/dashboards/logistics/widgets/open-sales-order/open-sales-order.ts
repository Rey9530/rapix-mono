import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { openSalesOrder } from '../../../../../shared/data/dashboard/logistics';

@Component({
  selector: 'app-open-sales-order',
  imports: [NgApexchartsModule, Card],
  templateUrl: './open-sales-order.html',
  styleUrl: './open-sales-order.scss',
})
export class OpenSalesOrder {
  public cardToggleOption = cardToggleOptions3;
  public openSalesOrder = openSalesOrder;
}
