import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';
import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';
import { squaresColor } from '../../../../../shared/data/dashboard/online-course';
import { ICourse } from '../../../../../shared/interface/dashboard/online-course';

@Component({
  selector: 'app-courses',
  imports: [RouterModule, Card, SvgIcon, NgClass],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses {
  readonly course = input<ICourse>();

  public squaresColor = squaresColor;
}
