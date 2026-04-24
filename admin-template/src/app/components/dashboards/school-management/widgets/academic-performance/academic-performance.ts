import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { academicPerformance } from '../../../../../shared/data/dashboard/school-management';

@Component({
  selector: 'app-academic-performance',
  imports: [NgApexchartsModule, Card],
  templateUrl: './academic-performance.html',
  styleUrl: './academic-performance.scss',
})
export class AcademicPerformance {
  public cardToggleOption = cardToggleOptions3;
  public academicPerformance = academicPerformance;
}
