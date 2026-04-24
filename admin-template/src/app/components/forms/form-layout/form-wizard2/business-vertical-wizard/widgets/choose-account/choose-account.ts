import { Component, input, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { chooseAccount } from '../../../../../../../shared/data/form-widgets';

@Component({
  selector: 'app-choose-account',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './choose-account.html',
  styleUrl: './choose-account.scss',
})
export class ChooseAccount {
  readonly active = input<number>(0);
  readonly changeTab = output<number>();

  public chooseAccount = chooseAccount;

  public formValidation = new FormGroup({
    chooseAccount: new FormControl('', Validators.required),
  });

  next() {
    const nextTab = this.active() + 1;
    this.changeTab.emit(nextTab);
  }
}
