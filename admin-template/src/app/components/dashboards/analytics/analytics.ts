import { SlicePipe } from '@angular/common';
import { Component } from '@angular/core';

import { AnalyticsDetails } from './widgets/analytics-details/analytics-details';
import { LiveUser } from './widgets/live-user/live-user';
import { PageAnalytics } from './widgets/page-analytics/page-analytics';
import { ReferralsVisit } from './widgets/referrals-visit/referrals-visit';
import { SessionByBrowser } from './widgets/session-by-browser/session-by-browser';
import { SessionByCountries } from './widgets/session-by-countries/session-by-countries';
import { WebsiteAnalytics } from './widgets/website-analytics/website-analytics';
import { cardToggleOptions2 } from '../../../shared/data/common';
import { analyticsDetailsChart } from '../../../shared/data/dashboard/analytics';
import { AllVisits } from '../../widgets/general/widgets/all-visits/all-visits';
import { SessionByDevice } from '../../widgets/general/widgets/session-by-device/session-by-device';

@Component({
  selector: 'app-analytics',
  imports: [
    AllVisits,
    ReferralsVisit,
    SessionByCountries,
    WebsiteAnalytics,
    AnalyticsDetails,
    PageAnalytics,
    LiveUser,
    SessionByDevice,
    SessionByBrowser,
    SlicePipe,
  ],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss',
})
export class Analytics {
  public cardToggleOption = cardToggleOptions2;
  public analyticsDetailsChart = analyticsDetailsChart;
}
