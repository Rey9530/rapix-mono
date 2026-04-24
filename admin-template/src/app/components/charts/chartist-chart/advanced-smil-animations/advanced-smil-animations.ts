import { Component } from '@angular/core';

import { ChartistModule } from 'ng-chartist';

import { Card } from '../../../../shared/components/ui/card/card';
import { advanceSMILChart } from '../../../../shared/data/charts/chartist-chart';

@Component({
  selector: 'app-advanced-smil-animations',
  imports: [ChartistModule, Card],
  templateUrl: './advanced-smil-animations.html',
  styleUrl: './advanced-smil-animations.scss',
})
export class AdvancedSmilAnimations {
  public advanceSMILChart = advanceSMILChart;
}
