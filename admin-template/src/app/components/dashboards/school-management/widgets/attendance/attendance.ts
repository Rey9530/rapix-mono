import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions1 } from '../../../../../shared/data/common';
import { attendance } from '../../../../../shared/data/dashboard/school-management';

@Component({
  selector: 'app-attendance',
  imports: [Card, NgApexchartsModule],
  templateUrl: './attendance.html',
  styleUrl: './attendance.scss',
})
export class Attendance {
  public cardToggleOption = cardToggleOptions1;
  public attendance = attendance;
}
