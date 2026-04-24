import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { taskStatistics } from '../../../../../shared/data/dashboard/projects';

@Component({
  selector: 'app-task-statistics',
  imports: [NgApexchartsModule, Card],
  templateUrl: './task-statistics.html',
  styleUrl: './task-statistics.scss',
})
export class TaskStatistics {
  public taskStatistics = taskStatistics;
  public cardToggleOption = cardToggleOptions3;
}
