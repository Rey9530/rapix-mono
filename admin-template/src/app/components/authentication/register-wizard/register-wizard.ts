import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AccountInfo } from './widgets/account-info/account-info';
import { AddressInfo } from './widgets/address-info/address-info';
import { IdentityInfo } from './widgets/identity-info/identity-info';
import { PersonalInfo } from './widgets/personal-info/personal-info';
import { FeatherIcon } from '../../../shared/components/ui/feather-icon/feather-icon';
import { registerTab } from '../../../shared/data/register-wizard';

@Component({
  selector: 'app-register-wizard',
  imports: [
    FormsModule,
    RouterModule,
    FeatherIcon,
    AccountInfo,
    AddressInfo,
    IdentityInfo,
    PersonalInfo,
    NgClass,
  ],
  templateUrl: './register-wizard.html',
  styleUrl: './register-wizard.scss',
})
export class RegisterWizard {
  public registerTab = registerTab;
  public activeTab: number = 1;
  public toast = {
    success: false,
    warning: false,
    error: false,
  };

  handleStep(value: number) {
    if (value == -1) {
      this.activeTab = this.activeTab - 1;
    } else if (value == 1 && this.activeTab < this.registerTab.length) {
      this.activeTab = this.activeTab + 1;
    }
  }

  showToast(value: keyof typeof this.toast) {
    this.toast[value] = true;

    setTimeout(() => {
      this.toast[value] = false;
    }, 5000);
  }
  closeToast(value: keyof typeof this.toast) {
    this.toast[value] = false;
  }
}
