import { Component } from '@angular/core';

import { BarRatingModule } from 'ngx-bar-rating';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-square-rating',
  imports: [BarRatingModule, Card],
  templateUrl: './square-rating.html',
  styleUrl: './square-rating.scss',
})
export class SquareRating {
  public squareRate = 1;
}
