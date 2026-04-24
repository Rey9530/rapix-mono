import { Component } from '@angular/core';

import { CurrentRatingBar } from './widgets/current-rating-bar/current-rating-bar';
import { HorizontalRatingBar } from './widgets/horizontal-rating-bar/horizontal-rating-bar';
import { MovieRating } from './widgets/movie-rating/movie-rating';
import { ResetRating } from './widgets/reset-rating/reset-rating';
import { SquareRating } from './widgets/square-rating/square-rating';
import { StarMsgRating } from './widgets/star-msg-rating/star-msg-rating';
import { StarRating } from './widgets/star-rating/star-rating';
import { VerticalRatingBar } from './widgets/vertical-rating-bar/vertical-rating-bar';

@Component({
  selector: 'app-rating',
  imports: [
    StarRating,
    StarMsgRating,
    ResetRating,
    HorizontalRatingBar,
    VerticalRatingBar,
    CurrentRatingBar,
    SquareRating,
    MovieRating,
  ],
  templateUrl: './rating.html',
  styleUrl: './rating.scss',
})
export class Rating {}
