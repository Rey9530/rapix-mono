import { Component, input, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Select2Module } from 'ng-select2-component';

import { contactDetails } from '../../../../../../../shared/data/form-widgets';

@Component({
  selector: 'app-contact-details',
  imports: [FormsModule, ReactiveFormsModule, Select2Module],
  templateUrl: './contact-details.html',
  styleUrl: './contact-details.scss',
})
export class ContactDetails {
  readonly active = input<number>(0);
  readonly changeTab = output<number>();

  public contactDetails = contactDetails;
  public validate = false;

  public formValidation = new FormGroup({
    organizationName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    description: new FormControl('', Validators.required),
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
