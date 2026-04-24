import { Component } from '@angular/core';

import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { BarRatingModule } from 'ngx-bar-rating';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-star-msg-rating',
  imports: [NgbRatingModule, BarRatingModule, Card],
  templateUrl: './star-msg-rating.html',
  styleUrl: './star-msg-rating.scss',
})
export class StarMsgRating {
  public faoRate = 0;
  public faoRated = false;

  public ratingMessages = [
    'Simple and effective',
    'Great value!',
    'High-quality product',
    'Will definitely order again',
    'Delicious and satisfying',
  ];

  onFaoRate(e: number) {
    this.faoRated = true;
    this.faoRate = e;
  }

  getRatingString(rating: number): string {
    return this.ratingMessages[rating - 1] || '';
  }
}
