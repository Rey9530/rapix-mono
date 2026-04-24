import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';
import { myCourses } from '../../../../../shared/data/dashboard/online-course';

@Component({
  selector: 'app-my-course',
  imports: [RouterModule, Card, FeatherIcon],
  templateUrl: './my-course.html',
  styleUrl: './my-course.scss',
})
export class MyCourse {
  public myCourses = myCourses;
}
