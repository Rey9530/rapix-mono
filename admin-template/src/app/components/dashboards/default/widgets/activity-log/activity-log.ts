import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions1 } from '../../../../../shared/data/common';
import { activityLogs } from '../../../../../shared/data/dashboard/default';

@Component({
  selector: 'app-activity-log',
  imports: [Card],
  templateUrl: './activity-log.html',
  styleUrl: './activity-log.scss',
})
export class ActivityLog {
  public cardToggleOptions = cardToggleOptions1;
  public activityLogs = activityLogs;
}
