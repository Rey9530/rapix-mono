import { SlicePipe, NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { AllVisits } from './widgets/all-visits/all-visits';
import { LastMonthDetails } from './widgets/last-month-details/last-month-details';
import { PageViews } from './widgets/page-views/page-views';
import { SessionByDevice } from './widgets/session-by-device/session-by-device';
import { TotalUsers } from './widgets/total-users/total-users';
import {
  averageDayDetails,
  currencyChart,
} from '../../../shared/data/dashboard/crypto';
import { details } from '../../../shared/data/dashboard/default';
import { courses } from '../../../shared/data/dashboard/online-course';
import { socialMediaDetails } from '../../../shared/data/dashboard/social';
import { lastMonthDetails } from '../../../shared/data/widgets/general';
import { AverageDayDetails } from '../../dashboards/crypto/widgets/average-day-details/average-day-details';
import { CurrencyChart } from '../../dashboards/crypto/widgets/currency-chart/currency-chart';
import { Details } from '../../dashboards/default/widgets/details/details';
import { WebsiteTraffic } from '../../dashboards/ecommerce/widgets/website-traffic/website-traffic';
import { ActivityHours } from '../../dashboards/online-course/widgets/activity-hours/activity-hours';
import { Courses } from '../../dashboards/online-course/widgets/courses/courses';
import { SocialMediaDetails } from '../../dashboards/social/widgets/social-media-details/social-media-details';

@Component({
  selector: 'app-general',
  imports: [
    SlicePipe,
    CurrencyChart,
    AverageDayDetails,
    Details,
    Courses,
    WebsiteTraffic,
    SessionByDevice,
    SocialMediaDetails,
    LastMonthDetails,
    TotalUsers,
    PageViews,
    AllVisits,
    ActivityHours,
    NgClass,
    SlicePipe,
  ],
  templateUrl: './general.html',
  styleUrl: './general.scss',
})
export class General {
  public currencyChart = currencyChart;
  public averageDayDetails = averageDayDetails;
  public details = details;
  public courses = courses;
  public socialMediaDetails = socialMediaDetails;
  public lastMonthDetails = lastMonthDetails;
}
