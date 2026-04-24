import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BestSellers } from './widgets/best-sellers/best-sellers';
import { Details } from './widgets/details/details';
import { MonthOrder } from './widgets/month-order/month-order';
import { MonthlyProfits } from './widgets/monthly-profits/monthly-profits';
import { OrderOverview } from './widgets/order-overview/order-overview';
import { PaymentGatewayEarning } from './widgets/payment-gateway-earning/payment-gateway-earning';
import { RecentActivity } from './widgets/recent-activity/recent-activity';
import { RecentOrders } from './widgets/recent-orders/recent-orders';
import { RecentTransactions } from './widgets/recent-transactions/recent-transactions';
import { StockReports } from './widgets/stock-reports/stock-reports';
import { TopCategories } from './widgets/top-categories/top-categories';
import { TopCustomers } from './widgets/top-customers/top-customers';
import { TotalEarnings } from './widgets/total-earnings/total-earnings';
import { TrendingProducts } from './widgets/trending-products/trending-products';
import { WebsiteTraffic } from './widgets/website-traffic/website-traffic';
import { Card } from '../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../shared/components/ui/feather-icon/feather-icon';
import { details } from '../../../shared/data/dashboard/e-commerce';

@Component({
  selector: 'app-ecommerce',
  imports: [
    RouterModule,
    TotalEarnings,
    Details,
    TopCustomers,
    MonthOrder,
    MonthlyProfits,
    RecentTransactions,
    WebsiteTraffic,
    RecentOrders,
    TopCategories,
    Card,
    RecentActivity,
    OrderOverview,
    StockReports,
    BestSellers,
    PaymentGatewayEarning,
    TrendingProducts,
    FeatherIcon,
  ],
  templateUrl: './ecommerce.html',
  styleUrl: './ecommerce.scss',
})
export class Ecommerce {
  public tilesDetails = details;
}
