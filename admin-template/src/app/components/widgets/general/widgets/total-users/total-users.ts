import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';
import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';
import { totalUsersChart } from '../../../../../shared/data/widgets/general';

@Component({
  selector: 'app-total-users',
  imports: [NgApexchartsModule, SvgIcon, FeatherIcon],
  templateUrl: './total-users.html',
  styleUrl: './total-users.scss',
})
export class TotalUsers {
  public totalUsersChart = totalUsersChart;
}
