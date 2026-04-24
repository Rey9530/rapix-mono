import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Card } from '../../../../shared/components/ui/card/card';
import { IBillingDetails } from '../../../../shared/interface/order';

@Component({
  selector: 'app-billing-details',
  imports: [RouterModule, Card, DecimalPipe],
  templateUrl: './billing-details.html',
  styleUrl: './billing-details.scss',
})
export class BillingDetails {
  readonly billing_details = input<IBillingDetails>();
}
