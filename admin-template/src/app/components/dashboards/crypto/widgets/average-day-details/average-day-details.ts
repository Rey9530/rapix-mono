import { Component, input } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';
import { IAverageDayDetails } from '../../../../../shared/interface/dashboard/crypto';

@Component({
  selector: 'app-average-day-details',
  imports: [NgApexchartsModule, Card, FeatherIcon],
  templateUrl: './average-day-details.html',
  styleUrl: './average-day-details.scss',
})
export class AverageDayDetails {
  readonly details = input<IAverageDayDetails>();
}
