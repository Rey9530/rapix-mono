import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { Completed } from './widgets/completed/completed';
import { ConnectBankAccount } from './widgets/connect-bank-account/connect-bank-account';
import { Inquiries } from './widgets/inquiries/inquiries';
import { PersonalInfo } from './widgets/personal-info/personal-info';
import { Card } from '../../../../../shared/components/ui/card/card';
import { customHorizontalWizard } from '../../../../../shared/data/form-widgets';

@Component({
  selector: 'app-custom-horizontal-wizard',
  imports: [
    NgbNavModule,
    FormsModule,
    PersonalInfo,
    ConnectBankAccount,
    Inquiries,
    Completed,
    Card,
  ],
  templateUrl: './custom-horizontal-wizard.html',
  styleUrl: './custom-horizontal-wizard.scss',
})
export class CustomHorizontalWizard {
  readonly type = input<string>('');
  readonly title = input<string>('Custom Horizontal Wizard');

  public customHorizontal = customHorizontalWizard;
  public active = 1;

  changeTab(value: number) {
    this.active = value;
  }
}
