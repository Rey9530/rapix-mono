import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions1 } from '../../../../../shared/data/common';
import {
  socialAnalytics,
  socialAnalyticsTab,
} from '../../../../../shared/data/dashboard/social';

@Component({
  selector: 'app-social-analytics',
  imports: [NgApexchartsModule, Card],
  templateUrl: './social-analytics.html',
  styleUrl: './social-analytics.scss',
})
export class SocialAnalytics {
  public cardToggleOption = cardToggleOptions1;
  public socialAnalyticsTab = socialAnalyticsTab;
  public socialAnalytics = socialAnalytics;
  public activeTab: string = 'youtube';

  handleTab(value: string) {
    this.activeTab = value;
  }
}
