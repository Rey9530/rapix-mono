import { Component } from '@angular/core';

import { BarRatingModule } from 'ngx-bar-rating';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-vertical-rating-bar',
  imports: [BarRatingModule, Card],
  templateUrl: './vertical-rating-bar.html',
  styleUrl: './vertical-rating-bar.scss',
})
export class VerticalRatingBar {
  public rate = 1;
}
