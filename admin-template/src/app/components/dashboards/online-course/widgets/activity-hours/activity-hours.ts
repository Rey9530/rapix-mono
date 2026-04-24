import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions5 } from '../../../../../shared/data/common';
import { activityHoursChart } from '../../../../../shared/data/dashboard/online-course';

@Component({
  selector: 'app-activity-hours',
  imports: [NgApexchartsModule, Card],
  templateUrl: './activity-hours.html',
  styleUrl: './activity-hours.scss',
})
export class ActivityHours {
  public activityHoursChart = activityHoursChart;
  public cardToggleOption = cardToggleOptions5;
}
