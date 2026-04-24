import { Component, input } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { IExpensesChart } from '../../../../../shared/interface/dashboard/projects';

@Component({
  selector: 'app-expenses-chart',
  imports: [Card, NgApexchartsModule, FeatherIcon],
  templateUrl: './expenses-chart.html',
  styleUrl: './expenses-chart.scss',
})
export class ExpensesChart {
  readonly chart = input<IExpensesChart>();

  public cardToggleOption = cardToggleOptions3;
}
