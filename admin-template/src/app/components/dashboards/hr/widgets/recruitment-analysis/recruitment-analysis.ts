import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions1 } from '../../../../../shared/data/common';
import { recruitmentAnalysis } from '../../../../../shared/data/dashboard/hr';

@Component({
  selector: 'app-recruitment-analysis',
  imports: [NgApexchartsModule, Card],
  templateUrl: './recruitment-analysis.html',
  styleUrl: './recruitment-analysis.scss',
})
export class RecruitmentAnalysis {
  public cardToggleOption = cardToggleOptions1;
  public recruitmentAnalysis = recruitmentAnalysis;
}
