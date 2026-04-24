import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';
import { activeCourse } from '../../../../../shared/data/dashboard/online-course';

@Component({
  selector: 'app-active-courses',
  imports: [RouterModule, NgApexchartsModule, Card, FeatherIcon],
  templateUrl: './active-courses.html',
  styleUrl: './active-courses.scss',
})
export class ActiveCourses {
  public activeCourse = activeCourse;
}
