import { Component, input, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Select2Module } from 'ng-select2-component';

import { selectState } from '../../../../../../../shared/data/form-layout';

@Component({
  selector: 'app-your-info',
  imports: [FormsModule, ReactiveFormsModule, Select2Module],
  templateUrl: './your-info.html',
  styleUrl: './your-info.scss',
})
export class YourInfo {
  readonly active = input<number>(0);

  readonly changeTab = output<number>();

  public validate = false;
  public selectState = selectState;

  public formValidation = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    state: new FormControl('', Validators.required),
    zipCode: new FormControl('', Validators.required),
    contactNumber: new FormControl('', Validators.required),
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
}
