import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';
import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';
import { pageViewsChart } from '../../../../../shared/data/widgets/general';

@Component({
  selector: 'app-page-views',
  imports: [NgApexchartsModule, FeatherIcon, SvgIcon],
  templateUrl: './page-views.html',
  styleUrl: './page-views.scss',
})
export class PageViews {
  public pageViewsChart = pageViewsChart;
}
