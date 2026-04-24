import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';
import { days, todaySchedule } from '../../../../../shared/data/dashboard/hr';
import {
  IDays,
  ITodaySchedule,
} from '../../../../../shared/interface/dashboard/hr';

@Component({
  selector: 'app-today-schedule',
  imports: [SvgIcon, Card],
  templateUrl: './today-schedule.html',
  styleUrl: './today-schedule.scss',
})
export class TodaySchedule {
  public days = days;
  public todaySchedule = todaySchedule;
  public activeDay: string = 'mon';
  public filteredSchedule: ITodaySchedule[];

  ngOnInit() {
    if (this.activeDay) {
      this.filteredSchedule = this.todaySchedule.filter((details) => {
        return details.value === this.activeDay;
      });
    }
  }

  changeDay(day: IDays) {
    this.activeDay = day.value;

    this.filteredSchedule = this.todaySchedule.filter((schedule) => {
      return schedule.value === this.activeDay;
    });
  }
}
