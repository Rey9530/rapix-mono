import { Component } from '@angular/core';

import { CommonLineChart } from './widgets/common-line-chart/common-line-chart';
import { CryptocurrencyAnnotation } from './widgets/cryptocurrency-annotation/cryptocurrency-annotation';
import { CryptocurrencyPrice } from './widgets/cryptocurrency-price/cryptocurrency-price';
import { Finance } from './widgets/finance/finance';
import { LiveProducts } from './widgets/live-products/live-products';
import { MonthlyHistory } from './widgets/monthly-history/monthly-history';
import { MonthlySales } from './widgets/monthly-sales/monthly-sales';
import { OrderStatus } from './widgets/order-status/order-status';
import { OrderStatus2 } from './widgets/order-status-2/order-status-2';
import { SkillStatus } from './widgets/skill-status/skill-status';
import { StockMarket } from './widgets/stock-market/stock-market';
import { TurnOver } from './widgets/turn-over/turn-over';
import { Users } from './widgets/users/users';
import { commonLineCharts } from '../../../shared/data/widgets/chart';

@Component({
  selector: 'app-charts',
  imports: [
    CommonLineChart,
    MonthlyHistory,
    LiveProducts,
    TurnOver,
    SkillStatus,
    OrderStatus,
    StockMarket,
    Finance,
    OrderStatus2,
    Users,
    MonthlySales,
    CryptocurrencyPrice,
    CryptocurrencyAnnotation,
  ],
  templateUrl: './charts.html',
  styleUrl: './charts.scss',
})
export class Charts {
  public commonLineCharts = commonLineCharts;
}
