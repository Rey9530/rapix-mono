import { Component, input, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { bankAccount } from '../../../../../../../shared/data/form-widgets';

@Component({
  selector: 'app-connect-bank-account',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './connect-bank-account.html',
  styleUrl: './connect-bank-account.scss',
})
export class ConnectBankAccount {
  readonly active = input<number>(0);
  readonly changeTab = output<number>();

  public bankAccount = bankAccount;
  public validate = false;

  public formValidation = new FormGroup({
    aadhar_number: new FormControl('', Validators.required),
    pan_number: new FormControl('', Validators.required),
  });

  next() {
    this.validate = true;
    this.formValidation.markAllAsTouched();

    if (this.formValidation.valid) {
      const nextTab = this.active() + 1;
      this.changeTab.emit(nextTab);
    }
  }

  previous() {
    const prevTab = this.active() - 1;
    this.changeTab.emit(prevTab);
  }
}
