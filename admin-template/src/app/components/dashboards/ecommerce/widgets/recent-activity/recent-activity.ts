import { Component } from '@angular/core';

import { recentActivity } from '../../../../../shared/data/dashboard/e-commerce';

@Component({
  selector: 'app-recent-activity',
  imports: [],
  templateUrl: './recent-activity.html',
  styleUrl: './recent-activity.scss',
})
export class RecentActivity {
  public recentActivity = recentActivity;
}
