import { Component } from '@angular/core';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../shared/components/ui/card/card';
import { SvgIcon } from '../../../../shared/components/ui/svg-icon/svg-icon';
import { cardToggleOptions1 } from '../../../../shared/data/common';
import { salesOverviewCharts } from '../../../../shared/data/store';

@Component({
  selector: 'app-sales-overview',
  imports: [NgbNavModule, NgApexchartsModule, Card, SvgIcon],
  templateUrl: './sales-overview.html',
  styleUrl: './sales-overview.scss',
})
export class SalesOverview {
  public cardToggleOption = cardToggleOptions1;
  public salesOverviewCharts = salesOverviewCharts;
  public activeTab: string = 'earning';
}
