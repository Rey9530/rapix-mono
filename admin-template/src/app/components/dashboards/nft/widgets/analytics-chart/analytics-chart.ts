import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';
import { analyticsCharts } from '../../../../../shared/data/dashboard/nft';
import { UpgradePlan } from '../upgrade-plan/upgrade-plan';

@Component({
  selector: 'app-analytics-chart',
  imports: [NgApexchartsModule, Card, FeatherIcon, UpgradePlan],
  templateUrl: './analytics-chart.html',
  styleUrl: './analytics-chart.scss',
})
export class AnalyticsChart {
  public analyticsCharts = analyticsCharts;
}
