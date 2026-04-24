import { Component } from '@angular/core';

import { BarRatingModule } from 'ngx-bar-rating';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-movie-rating',
  imports: [BarRatingModule, Card],
  templateUrl: './movie-rating.html',
  styleUrl: './movie-rating.scss',
})
export class MovieRating {
  public movieRate = 2;
}
