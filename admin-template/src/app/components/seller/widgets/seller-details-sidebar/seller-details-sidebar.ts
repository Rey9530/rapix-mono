import { Component } from '@angular/core';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { SellerDetails } from './seller-details/seller-details';
import { SellerNotifications } from './seller-notifications/seller-notifications';
import { SellerPolicies } from './seller-policies/seller-policies';
import { SellerProductReview } from './seller-product-review/seller-product-review';
import { SellerRating } from './seller-rating/seller-rating';

@Component({
  selector: 'app-seller-details-sidebar',
  imports: [
    NgbAccordionModule,
    SellerDetails,
    SellerRating,
    SellerNotifications,
    SellerPolicies,
    SellerProductReview,
  ],
  templateUrl: './seller-details-sidebar.html',
  styleUrl: './seller-details-sidebar.scss',
})
export class SellerDetailsSidebar {
  public sidebarOpen: boolean = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
