import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { performanceOverview } from '../../../../../shared/data/dashboard/school-management';

@Component({
  selector: 'app-performance-overview',
  imports: [NgApexchartsModule, Card],
  templateUrl: './performance-overview.html',
  styleUrl: './performance-overview.scss',
})
export class PerformanceOverview {
  public performanceOverview = performanceOverview;
}
