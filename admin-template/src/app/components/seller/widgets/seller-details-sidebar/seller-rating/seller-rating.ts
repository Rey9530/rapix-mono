import { Component } from '@angular/core';

import { sellerDetails } from '../../../../../shared/data/store';

@Component({
  selector: 'app-seller-rating',
  templateUrl: './seller-rating.html',
  styleUrl: './seller-rating.scss',
})
export class SellerRating {
  public sellerRating = sellerDetails.rating;
  public rating: number[] = Array.from({ length: 5 }, (_, i) => i + 1);
}
