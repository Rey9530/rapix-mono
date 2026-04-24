import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions2 } from '../../../../../shared/data/common';
import { allVisitsChart } from '../../../../../shared/data/widgets/general';

@Component({
  selector: 'app-all-visits',
  imports: [NgApexchartsModule, Card],
  templateUrl: './all-visits.html',
  styleUrl: './all-visits.scss',
})
export class AllVisits {
  public allVisitsChart = allVisitsChart;
  public cardToggleOption = cardToggleOptions2;
}
