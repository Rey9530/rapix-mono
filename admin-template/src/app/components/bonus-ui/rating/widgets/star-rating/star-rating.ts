import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';

import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-star-rating',
  imports: [NgbRatingModule, Card, NgClass],
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.scss',
})
export class StarRating {
  private config = inject(NgbRatingConfig);

  public rating = 2;

  constructor() {
    this.config.readonly = false;
  }
}
