import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions5 } from '../../../../../shared/data/common';
import { upcomingCourses } from '../../../../../shared/data/dashboard/online-course';

@Component({
  selector: 'app-upcoming-courses',
  imports: [NgApexchartsModule, Card],
  templateUrl: './upcoming-courses.html',
  styleUrl: './upcoming-courses.scss',
})
export class UpcomingCourses {
  public upcomingCourses = upcomingCourses;
  public cardToggleOption = cardToggleOptions5;
}
