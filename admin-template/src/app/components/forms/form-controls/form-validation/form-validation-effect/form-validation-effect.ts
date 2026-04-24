import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-form-validation-effect',
  imports: [ReactiveFormsModule, FormsModule, Card],
  templateUrl: './form-validation-effect.html',
  styleUrl: './form-validation-effect.scss',
})
export class FormValidationEffect {
  public formValidation = new FormGroup({
    fullName: new FormControl('', Validators.required),
    gmail: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    confirm_password: new FormControl('', Validators.required),
  });

  submitForm() {
    this.formValidation.markAllAsTouched();
    if (this.formValidation.valid) {
      window.location.reload();
    }
  }
}
