import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { CardDropdownButton } from '../../../../../shared/components/ui/card/card-dropdown-button/card-dropdown-button';
import { cardToggleOptions7 } from '../../../../../shared/data/common';
import { incomeChart } from '../../../../../shared/data/dashboard/nft';

@Component({
  selector: 'app-income-chart',
  imports: [NgApexchartsModule, CardDropdownButton],
  templateUrl: './income-chart.html',
  styleUrl: './income-chart.scss',
})
export class IncomeChart {
  public cardToggleOption = cardToggleOptions7;
  public incomeChart = incomeChart;
}
