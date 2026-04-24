import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { financeChart } from '../../../../../shared/data/widgets/chart';

@Component({
  selector: 'app-finance',
  imports: [NgApexchartsModule, Card],
  templateUrl: './finance.html',
  styleUrl: './finance.scss',
})
export class Finance {
  public financeChart = financeChart;
}
