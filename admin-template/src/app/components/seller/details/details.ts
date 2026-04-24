import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { storeGeneralDetails } from '../../../shared/data/store';
import { Products } from '../../product/product-list/products/products';
import { RecentOrders } from '../widgets/recent-orders/recent-orders';
import { SalesOverview } from '../widgets/sales-overview/sales-overview';
import { SellerDetailsSidebar } from '../widgets/seller-details-sidebar/seller-details-sidebar';
import { StoreGeneralDetails } from '../widgets/store-general-details/store-general-details';
import { TopSellingProducts } from '../widgets/top-selling-products/top-selling-products';

@Component({
  selector: 'app-details',
  imports: [
    RouterModule,
    StoreGeneralDetails,
    SalesOverview,
    TopSellingProducts,
    RecentOrders,
    Products,
    SellerDetailsSidebar,
  ],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class Details {
  public storeGeneralDetails = storeGeneralDetails;
}
