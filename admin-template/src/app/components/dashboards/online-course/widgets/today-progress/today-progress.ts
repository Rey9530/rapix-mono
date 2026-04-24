import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { todayProgressChart } from '../../../../../shared/data/dashboard/online-course';

@Component({
  selector: 'app-today-progress',
  imports: [NgApexchartsModule, Card],
  templateUrl: './today-progress.html',
  styleUrl: './today-progress.scss',
})
export class TodayProgress {
  public todayProgress = todayProgressChart;
}
