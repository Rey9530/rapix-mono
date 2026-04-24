import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';
import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';
import { upcomingSchedule } from '../../../../../shared/data/dashboard/online-course';

@Component({
  selector: 'app-upcoming-schedule',
  imports: [RouterModule, Card, SvgIcon],
  templateUrl: './upcoming-schedule.html',
  styleUrl: './upcoming-schedule.scss',
})
export class UpcomingSchedule {
  public upcomingSchedule = upcomingSchedule;
}
