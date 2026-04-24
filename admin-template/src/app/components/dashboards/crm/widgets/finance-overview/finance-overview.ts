import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions5 } from '../../../../../shared/data/common';
import { financeOverviewChart } from '../../../../../shared/data/dashboard/crm';

@Component({
  selector: 'app-finance-overview',
  imports: [NgApexchartsModule, Card],
  templateUrl: './finance-overview.html',
  styleUrl: './finance-overview.scss',
})
export class FinanceOverview {
  public financeOverviewChart = financeOverviewChart;
  public cardToggleOption = cardToggleOptions5;
}
