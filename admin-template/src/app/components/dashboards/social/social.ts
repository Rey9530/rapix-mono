import { Component } from '@angular/core';

import { AllCampaigns } from './widgets/all-campaigns/all-campaigns';
import { FacebookCampaign } from './widgets/facebook-campaign/facebook-campaign';
import { InstagramSubscribers } from './widgets/instagram-subscribers/instagram-subscribers';
import { SocialAnalytics } from './widgets/social-analytics/social-analytics';
import { SocialAnalyticsCharts } from './widgets/social-analytics-charts/social-analytics-charts';
import { SocialMediaAnnouncement } from './widgets/social-media-announcement/social-media-announcement';
import { SocialMediaDetails } from './widgets/social-media-details/social-media-details';
import { TopFollowers } from './widgets/top-followers/top-followers';
import {
  socialAnalyticsChart,
  socialMediaDetails,
} from '../../../shared/data/dashboard/social';

@Component({
  selector: 'app-social',
  imports: [
    SocialMediaDetails,
    SocialMediaAnnouncement,
    InstagramSubscribers,
    FacebookCampaign,
    AllCampaigns,
    SocialAnalyticsCharts,
    SocialAnalytics,
    TopFollowers,
  ],
  templateUrl: './social.html',
  styleUrl: './social.scss',
})
export class Social {
  public socialMediaDetails = socialMediaDetails;
  public socialAnalyticsChart = socialAnalyticsChart;
}
