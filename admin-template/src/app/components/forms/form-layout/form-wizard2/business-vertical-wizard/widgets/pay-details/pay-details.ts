import { Component, input, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Select2Data, Select2Module } from 'ng-select2-component';

@Component({
  selector: 'app-pay-details',
  imports: [FormsModule, ReactiveFormsModule, Select2Module],
  templateUrl: './pay-details.html',
  styleUrl: './pay-details.scss',
})
export class PayDetails {
  readonly active = input<number>(0);
  readonly changeTab = output<number>();

  public validate = false;
  public year: Select2Data = [];

  public formValidation = new FormGroup({
    cardHolder: new FormControl('', Validators.required),
    cardNumber: new FormControl('', Validators.required),
    expireDate: new FormControl('', Validators.required),
    cvv: new FormControl('', Validators.required),
    agree: new FormControl('', Validators.required),
  });

  constructor() {
    for (let i = 2024; i <= 2035; i++) {
      this.year.push({ value: i, label: i.toString() });
    }
  }

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
