import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cryptoCurrencyPriceChart } from '../../../../../shared/data/widgets/chart';

@Component({
  selector: 'app-cryptocurrency-price',
  imports: [NgApexchartsModule, Card],
  templateUrl: './cryptocurrency-price.html',
  styleUrl: './cryptocurrency-price.scss',
})
export class CryptocurrencyPrice {
  public cryptoCurrencyPriceChart = cryptoCurrencyPriceChart;
}
