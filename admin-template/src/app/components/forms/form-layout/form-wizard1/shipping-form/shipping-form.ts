import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';
import {
  productDetails,
  productTotal,
  shippingForm,
} from '../../../../../shared/data/form-layout';
import { Completed } from '../../../../checkout/widgets/completed/completed';
import { Information } from '../../../../checkout/widgets/information/information';
import { Payment } from '../../../../checkout/widgets/payment/payment';
import { Shipping } from '../../../../checkout/widgets/shipping/shipping';

@Component({
  selector: 'app-shipping-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgbNavModule,
    Information,
    Shipping,
    Payment,
    Completed,
    Card,
  ],
  templateUrl: './shipping-form.html',
  styleUrl: './shipping-form.scss',
})
export class ShippingForm {
  public shippingForm = shippingForm;
  public productDetails = productDetails;
  public productTotal = productTotal;
  public activeTab: number = 1;

  handleStep(value: number) {
    if (value == -1) {
      this.activeTab = this.activeTab - 1;
    } else if (value == 1 && this.activeTab < this.shippingForm.length) {
      this.activeTab = this.activeTab + 1;
    }
  }

  changeTab(tabId: number) {
    if (tabId >= 1 && tabId <= this.shippingForm.length) {
      this.activeTab = tabId;
    }
  }
}
