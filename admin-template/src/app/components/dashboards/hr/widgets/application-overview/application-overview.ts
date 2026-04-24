import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { applicationOverview } from '../../../../../shared/data/dashboard/hr';
import { cardToggleOptions1 } from './../../../../../shared/data/common';

@Component({
  selector: 'app-application-overview',
  imports: [NgApexchartsModule, Card],
  templateUrl: './application-overview.html',
  styleUrl: './application-overview.scss',
})
export class ApplicationOverview {
  public applicationOverview = applicationOverview;
  public cardToggleOption = cardToggleOptions1;
}
