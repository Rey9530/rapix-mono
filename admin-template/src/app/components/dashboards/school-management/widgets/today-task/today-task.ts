import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';
import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { todayTask } from '../../../../../shared/data/dashboard/school-management';

@Component({
  selector: 'app-today-task',
  imports: [SvgIcon, Card, RouterModule],
  templateUrl: './today-task.html',
  styleUrl: './today-task.scss',
})
export class TodayTask {
  public todayTask = todayTask;
  public cardToggleOption = cardToggleOptions3;
}
