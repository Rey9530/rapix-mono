import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { schoolPerformance } from '../../../../../shared/data/dashboard/school-management';

@Component({
  selector: 'app-school-performance',
  imports: [NgApexchartsModule, Card],
  templateUrl: './school-performance.html',
  styleUrl: './school-performance.scss',
})
export class SchoolPerformance {
  public schoolPerformance = schoolPerformance;
  public cardToggleOption = cardToggleOptions3;
}
