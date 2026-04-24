import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { pipelineBreakdownChart } from '../../../../../shared/data/dashboard/crm';
import { cardToggleOptions5 } from './../../../../../shared/data/common';

@Component({
  selector: 'app-pipeline-breakdown',
  imports: [NgApexchartsModule, Card],
  templateUrl: './pipeline-breakdown.html',
  styleUrl: './pipeline-breakdown.scss',
})
export class PipelineBreakdown {
  public pipelineBreakdownChart = pipelineBreakdownChart;
  public cardToggleOption = cardToggleOptions5;
}
