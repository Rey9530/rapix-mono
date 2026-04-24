import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import {
  orderOverviewBarChart,
  orderOverviewChart,
} from '../../../../../shared/data/dashboard/e-commerce';

@Component({
  selector: 'app-order-overview',
  imports: [NgApexchartsModule, Card, SvgIcon],
  templateUrl: './order-overview.html',
  styleUrl: './order-overview.scss',
})
export class OrderOverview {
  public cardToggleOption = cardToggleOptions3;
  public orderOverviewChart = orderOverviewChart;
  public orderOverviewBarChart = orderOverviewBarChart;
}
