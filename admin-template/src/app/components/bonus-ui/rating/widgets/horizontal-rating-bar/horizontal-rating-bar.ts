import { Component } from '@angular/core';

import { BarRatingModule } from 'ngx-bar-rating';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-horizontal-rating-bar',
  imports: [BarRatingModule, Card],
  templateUrl: './horizontal-rating-bar.html',
  styleUrl: './horizontal-rating-bar.scss',
})
export class HorizontalRatingBar {
  public rate = 7;
}
