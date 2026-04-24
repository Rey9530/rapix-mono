import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { monthlyProfitsChart } from '../../../../../shared/data/dashboard/e-commerce';

@Component({
  selector: 'app-monthly-profits',
  imports: [NgApexchartsModule, Card],
  templateUrl: './monthly-profits.html',
  styleUrl: './monthly-profits.scss',
})
export class MonthlyProfits {
  public cardToggleOption = cardToggleOptions3;
  public profitChart = monthlyProfitsChart;
}
