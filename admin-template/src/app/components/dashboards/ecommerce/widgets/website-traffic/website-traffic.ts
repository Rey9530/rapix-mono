import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';
import { cardToggleOptions4 } from '../../../../../shared/data/common';
import { websiteTrafficChart } from '../../../../../shared/data/dashboard/e-commerce';

@Component({
  selector: 'app-website-traffic',
  imports: [NgApexchartsModule, Card, SvgIcon],
  templateUrl: './website-traffic.html',
  styleUrl: './website-traffic.scss',
})
export class WebsiteTraffic {
  public cardToggleOption = cardToggleOptions4;
  public websiteTrafficChart = websiteTrafficChart;
}
