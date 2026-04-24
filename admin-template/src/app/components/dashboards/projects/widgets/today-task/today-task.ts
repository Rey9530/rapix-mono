import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { todayTask } from '../../../../../shared/data/dashboard/projects';

@Component({
  selector: 'app-today-task',
  imports: [SvgIcon, Card],
  templateUrl: './today-task.html',
  styleUrl: './today-task.scss',
})
export class TodayTask {
  public cardToggleOption = cardToggleOptions3;
  public todayTask = todayTask;
}
