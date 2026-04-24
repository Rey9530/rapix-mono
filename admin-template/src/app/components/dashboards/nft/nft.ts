import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { ActivityPanel } from './widgets/activity-panel/activity-panel';
import { AnalyticsChart } from './widgets/analytics-chart/analytics-chart';
import { ArtworkTable } from './widgets/artwork-table/artwork-table';
import { Artworks } from './widgets/artworks/artworks';
import { Banner } from './widgets/banner/banner';
import { Collections } from './widgets/collections/collections';
import { Creators } from './widgets/creators/creators';
import { ExploreArtwork } from './widgets/explore-artwork/explore-artwork';
import { IncomeChart } from './widgets/income-chart/income-chart';
import { LiveAuction } from './widgets/live-auction/live-auction';
import { Statistics } from './widgets/statistics/statistics';
import { TopNft } from './widgets/top-nft/top-nft';
import { TrendingBids } from './widgets/trending-bids/trending-bids';
import { TrendingCreator } from './widgets/trending-creator/trending-creator';
import { WelcomeCard } from './widgets/welcome-card/welcome-card';
import { activityPanel } from '../../../shared/data/dashboard/nft';

@Component({
  selector: 'app-nft',
  imports: [
    TrendingCreator,
    Banner,
    WelcomeCard,
    IncomeChart,
    Artworks,
    TrendingBids,
    AnalyticsChart,
    ExploreArtwork,
    TopNft,
    Statistics,
    ActivityPanel,
    LiveAuction,
    Creators,
    Collections,
    ArtworkTable,
    NgClass,
  ],
  templateUrl: './nft.html',
  styleUrl: './nft.scss',
})
export class Nft {
  public activityPanel = activityPanel;
}
