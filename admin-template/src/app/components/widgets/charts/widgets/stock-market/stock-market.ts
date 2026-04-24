import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { stockMarketChart } from '../../../../../shared/data/widgets/chart';

@Component({
  selector: 'app-stock-market',
  imports: [NgApexchartsModule, Card],
  templateUrl: './stock-market.html',
  styleUrl: './stock-market.scss',
})
export class StockMarket {
  public stockMarketChart = stockMarketChart;
}
