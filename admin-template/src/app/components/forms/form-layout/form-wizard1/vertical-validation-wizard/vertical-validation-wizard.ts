import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { CartInfo } from './widgets/cart-info/cart-info';
import { NetBanking } from './widgets/net-banking/net-banking';
import { YourInfo } from './widgets/your-info/your-info';
import { Card } from '../../../../../shared/components/ui/card/card';
import { verticalValidation } from '../../../../../shared/data/form-layout';

@Component({
  selector: 'app-vertical-validation-wizard',
  imports: [FormsModule, YourInfo, NgbNavModule, CartInfo, NetBanking, Card],
  templateUrl: './vertical-validation-wizard.html',
  styleUrl: './vertical-validation-wizard.scss',
})
export class VerticalValidationWizard {
  public verticalValidation = verticalValidation;
  public active = 1;

  changeTab(value: number) {
    this.active = value;
  }
}
