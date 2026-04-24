import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { sellerDetails } from '../../../../../shared/data/store';

@Component({
  selector: 'app-seller-product-review',
  imports: [NgbRatingModule, NgClass],
  templateUrl: './seller-product-review.html',
  styleUrl: './seller-product-review.scss',
})
export class SellerProductReview {
  public productReview = sellerDetails.review;
}
