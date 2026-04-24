import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { BusinessSetting } from './widgets/business-setting/business-setting';
import { ChooseAccount } from './widgets/choose-account/choose-account';
import { Completed } from './widgets/completed/completed';
import { ContactDetails } from './widgets/contact-details/contact-details';
import { PayDetails } from './widgets/pay-details/pay-details';
import { Card } from '../../../../../shared/components/ui/card/card';
import { businessVerticalWizard } from '../../../../../shared/data/form-widgets';

@Component({
  selector: 'app-business-vertical-wizard',
  imports: [
    NgbNavModule,
    FormsModule,
    ChooseAccount,
    BusinessSetting,
    ContactDetails,
    PayDetails,
    Completed,
    Card,
  ],
  templateUrl: './business-vertical-wizard.html',
  styleUrl: './business-vertical-wizard.scss',
})
export class BusinessVerticalWizard {
  readonly type = input<string>('');
  readonly title = input<string>('Business Vertical Wizard');

  public businessVerticalWizard = businessVerticalWizard;
  public active = 1;

  changeTab(value: number) {
    this.active = value;
  }
}
