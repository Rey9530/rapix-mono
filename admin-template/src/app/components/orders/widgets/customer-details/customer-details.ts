import { Component, input } from '@angular/core';

import { Card } from '../../../../shared/components/ui/card/card';
import { ICustomerDetails } from '../../../../shared/interface/order';

@Component({
  selector: 'app-customer-details',
  imports: [Card],
  templateUrl: './customer-details.html',
  styleUrl: './customer-details.scss',
})
export class CustomerDetails {
  readonly customer_details = input<ICustomerDetails>();
}
