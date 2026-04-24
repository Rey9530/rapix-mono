import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';
import { cardToggleOptions1 } from '../../../../../shared/data/common';
import { monthlyTargetChart } from '../../../../../shared/data/dashboard/default';

@Component({
  selector: 'app-monthly-target',
  imports: [NgApexchartsModule, Card, FeatherIcon],
  templateUrl: './monthly-target.html',
  styleUrl: './monthly-target.scss',
})
export class MonthlyTarget {
  public cardToggleOptions = cardToggleOptions1;
  public monthlyTargetChart = monthlyTargetChart;
}
