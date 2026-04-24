import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions1 } from '../../../../../shared/data/common';
import { projectAnalysis } from '../../../../../shared/data/dashboard/projects';

@Component({
  selector: 'app-project-analysis',
  imports: [NgApexchartsModule, Card],
  templateUrl: './project-analysis.html',
  styleUrl: './project-analysis.scss',
})
export class ProjectAnalysis {
  public cardToggleOption = cardToggleOptions1;
  public projectAnalysis = projectAnalysis;
}
