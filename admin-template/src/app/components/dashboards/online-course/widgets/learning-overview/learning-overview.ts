import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { learningOverviewChart } from '../../../../../shared/data/dashboard/online-course';

@Component({
  selector: 'app-learning-overview',
  imports: [NgApexchartsModule, Card],
  templateUrl: './learning-overview.html',
  styleUrl: './learning-overview.scss',
})
export class LearningOverview {
  public cardToggleOption = cardToggleOptions3;
  public learningOverviewChart = learningOverviewChart;
}
