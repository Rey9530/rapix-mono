import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BasicInfo } from './widgets/basic-info/basic-info';
import { CartInfo } from './widgets/cart-info/cart-info';
import { Feedback } from './widgets/feedback/feedback';
import { Finish } from './widgets/finish/finish';
import { Card } from '../../../../../shared/components/ui/card/card';
import { numberingWizardTabs } from '../../../../../shared/data/form-layout';

@Component({
  selector: 'app-numbering-wizard',
  imports: [FormsModule, BasicInfo, CartInfo, Feedback, Finish, Card, NgClass],
  templateUrl: './numbering-wizard.html',
  styleUrl: './numbering-wizard.scss',
})
export class NumberingWizard {
  public numberingTabs = numberingWizardTabs;
  public activeTab: number = 1;

  handleStep(value: number) {
    if (value == -1) {
      this.activeTab = this.activeTab - 1;
    } else if (value == 1 && this.activeTab < this.numberingTabs.length) {
      this.activeTab = this.activeTab + 1;
    }
  }
}
