import { Component } from '@angular/core';

import { Activities } from './widgets/activities/activities';
import { AverageDayDetails } from './widgets/average-day-details/average-day-details';
import { AverageSalePrice } from './widgets/average-sale-price/average-sale-price';
import { Balance } from './widgets/balance/balance';
import { BuyCoin } from './widgets/buy-coin/buy-coin';
import { CurrencyChart } from './widgets/currency-chart/currency-chart';
import { DetailsCard } from './widgets/details-card/details-card';
import { MarketGraph } from './widgets/market-graph/market-graph';
import { MyCurrency } from './widgets/my-currency/my-currency';
import { MyPortfolio } from './widgets/my-portfolio/my-portfolio';
import { SellCoin } from './widgets/sell-coin/sell-coin';
import { TopPerformers } from './widgets/top-performers/top-performers';
import { Transactions } from './widgets/transactions/transactions';
import {
  averageDayDetails,
  currencyChart,
} from '../../../shared/data/dashboard/crypto';

@Component({
  selector: 'app-crypto',
  imports: [
    DetailsCard,
    AverageDayDetails,
    Transactions,
    CurrencyChart,
    MarketGraph,
    MyCurrency,
    BuyCoin,
    SellCoin,
    Balance,
    MyPortfolio,
    Activities,
    AverageSalePrice,
    TopPerformers,
  ],
  templateUrl: './crypto.html',
  styleUrl: './crypto.scss',
})
export class Crypto {
  public averageDayDetails = averageDayDetails;
  public currencyChart = currencyChart;
}
