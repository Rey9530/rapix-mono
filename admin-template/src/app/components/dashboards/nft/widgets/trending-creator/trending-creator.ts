import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';
import { trendingCreator } from '../../../../../shared/data/dashboard/nft';

@Component({
  selector: 'app-trending-creator',
  imports: [RouterModule, Card],
  templateUrl: './trending-creator.html',
  styleUrl: './trending-creator.scss',
})
export class TrendingCreator {
  public trendingCreator = trendingCreator;
}
