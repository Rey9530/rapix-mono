import { Component, input, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { cartInfo } from '../../../../../../../shared/data/form-layout';

@Component({
  selector: 'app-cart-info',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './cart-info.html',
  styleUrl: './cart-info.scss',
})
export class CartInfo {
  readonly active = input<number>(0);
  readonly changeTab = output<number>();

  public cartInfo = cartInfo;
  public validate = false;

  public formValidation = new FormGroup({
    cardNumber: new FormControl('', Validators.required),
    expiration: new FormControl('', Validators.required),
    cvv: new FormControl('', Validators.required),
    uploadDocument: new FormControl('', Validators.required),
    agree: new FormControl('', Validators.required),
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
