import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { monthlySalesChart } from '../../../../../shared/data/widgets/chart';

@Component({
  selector: 'app-monthly-sales',
  imports: [NgApexchartsModule, Card],
  templateUrl: './monthly-sales.html',
  styleUrl: './monthly-sales.scss',
})
export class MonthlySales {
  public monthlySalesChart = monthlySalesChart;
}
