import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions9 } from '../../../../../shared/data/common';
import { studentChart } from '../../../../../shared/data/dashboard/school-management';

@Component({
  selector: 'app-student',
  imports: [NgApexchartsModule, Card],
  templateUrl: './student.html',
  styleUrl: './student.scss',
})
export class Student {
  public studentChart = studentChart;
  public cardToggleOption = cardToggleOptions9;
}
