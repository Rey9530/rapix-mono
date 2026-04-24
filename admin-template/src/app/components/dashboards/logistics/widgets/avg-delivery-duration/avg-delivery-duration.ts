import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { deliveryDuration } from '../../../../../shared/data/dashboard/logistics';

@Component({
  selector: 'app-avg-delivery-duration',
  imports: [NgApexchartsModule, Card],
  templateUrl: './avg-delivery-duration.html',
  styleUrl: './avg-delivery-duration.scss',
})
export class AvgDeliveryDuration {
  public cardToggleOption = cardToggleOptions3;
  public deliveryDuration = deliveryDuration;
}
