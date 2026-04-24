import { Component } from '@angular/core';

import { BarRatingModule } from 'ngx-bar-rating';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-current-rating-bar',
  imports: [BarRatingModule, Card],
  templateUrl: './current-rating-bar.html',
  styleUrl: './current-rating-bar.scss',
})
export class CurrentRatingBar {
  public faoRate = 3;
  public faoRated = false;

  onFaoRate(e: number) {
    this.faoRated = true;
    this.faoRate = e;
  }

  faoReset() {
    this.faoRated = false;
    this.faoRate = 3;
  }
}
