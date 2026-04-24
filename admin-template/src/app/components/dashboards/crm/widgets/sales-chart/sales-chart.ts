import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { CardDropdownButton } from '../../../../../shared/components/ui/card/card-dropdown-button/card-dropdown-button';
import { cardToggleOptions5 } from '../../../../../shared/data/common';
import { salesChart } from '../../../../../shared/data/dashboard/crm';

@Component({
  selector: 'app-sales-chart',
  imports: [NgApexchartsModule, CardDropdownButton],
  templateUrl: './sales-chart.html',
  styleUrl: './sales-chart.scss',
})
export class SalesChart {
  public salesChart = salesChart;
  public cardToggleOption = cardToggleOptions5;
}
