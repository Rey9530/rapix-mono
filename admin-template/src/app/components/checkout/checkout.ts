import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { Completed } from './widgets/completed/completed';
import { Information } from './widgets/information/information';
import { Payment } from './widgets/payment/payment';
import { Shipping } from './widgets/shipping/shipping';
import { Card } from '../../shared/components/ui/card/card';
import { checkoutTabs, orderDetails } from '../../shared/data/order';

@Component({
  selector: 'app-checkout',
  imports: [
    NgbNavModule,
    Card,
    Information,
    Shipping,
    Payment,
    Completed,
    NgClass,
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout {
  router = inject(Router);

  public activeTab: number = 1;
  public orderDetails = orderDetails;
  public checkoutTabs = checkoutTabs;

  handleStep(value: number) {
    if (value == -1) {
      this.activeTab = this.activeTab - 1;
    } else if (value == 1 && this.activeTab < this.checkoutTabs.length) {
      this.activeTab = this.activeTab + 1;
    }
  }

  placeOrder() {
    this.router.navigate(['/order/1']);
  }
}
