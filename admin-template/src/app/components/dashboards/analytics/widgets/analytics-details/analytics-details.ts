import { Component, input } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';
import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';
import { IAnalyticsDetailsChart } from '../../../../../shared/interface/dashboard/analytics';

@Component({
  selector: 'app-analytics-details',
  imports: [NgApexchartsModule, FeatherIcon, SvgIcon],
  templateUrl: './analytics-details.html',
  styleUrl: './analytics-details.scss',
})
export class AnalyticsDetails {
  readonly chart = input<IAnalyticsDetailsChart>();
}
