import { Component, input, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { inquiries } from '../../../../../../../shared/data/form-widgets';

@Component({
  selector: 'app-inquiries',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './inquiries.html',
  styleUrl: './inquiries.scss',
})
export class Inquiries {
  readonly active = input<number>(0);
  readonly changeTab = output<number>();

  public inquiries = inquiries;
  public validate = false;

  public formValidation = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    contactNumber: new FormControl('', Validators.required),
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
