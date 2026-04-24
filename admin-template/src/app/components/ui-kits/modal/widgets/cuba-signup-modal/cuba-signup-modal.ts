import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cuba-signup-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './cuba-signup-modal.html',
  styleUrl: './cuba-signup-modal.scss',
})
export class CubaSignupModal {
  private modal = inject(NgbActiveModal);

  public signUpForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    policy: new FormControl(true, [Validators.required]),
  });

  handleChange(event: Event) {
    const value = (event.target as HTMLInputElement).checked;
    this.signUpForm.get('policy')?.setValue(value);
  }

  submit() {
    this.signUpForm.markAllAsTouched();

    if (this.signUpForm.valid) {
      this.modal.close();
    }
  }
}
