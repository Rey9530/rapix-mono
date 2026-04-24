import { Component, input } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { ISocialAnalyticsChart } from '../../../../../shared/interface/dashboard/social';

@Component({
  selector: 'app-social-analytics-charts',
  imports: [NgApexchartsModule, Card],
  templateUrl: './social-analytics-charts.html',
  styleUrl: './social-analytics-charts.scss',
})
export class SocialAnalyticsCharts {
  readonly analyticsChart = input<ISocialAnalyticsChart>();

  public cardToggleOption = cardToggleOptions3;
}
