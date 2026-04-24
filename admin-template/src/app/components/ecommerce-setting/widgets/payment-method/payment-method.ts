import { Component } from '@angular/core';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-payment-method',
  imports: [NgbNavModule],
  templateUrl: './payment-method.html',
  styleUrl: './payment-method.scss',
})
export class PaymentMethod {
  public active = 'paypal';
}
