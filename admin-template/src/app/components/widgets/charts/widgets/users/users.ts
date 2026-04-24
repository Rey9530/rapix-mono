import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { usersChart } from '../../../../../shared/data/widgets/chart';

@Component({
  selector: 'app-users',
  imports: [NgApexchartsModule, Card],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {
  public usersChart = usersChart;
}
