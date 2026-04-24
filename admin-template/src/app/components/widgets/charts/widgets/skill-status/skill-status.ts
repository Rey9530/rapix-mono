import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { skillStatusChart } from '../../../../../shared/data/widgets/chart';

@Component({
  selector: 'app-skill-status',
  imports: [NgApexchartsModule, Card],
  templateUrl: './skill-status.html',
  styleUrl: './skill-status.scss',
})
export class SkillStatus {
  public skillStatusChart = skillStatusChart;
}
