import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Select2Module } from 'ng-select2-component';

import { Card } from '../../../../../shared/components/ui/card/card';
import {
  selectState,
  selectTheme,
} from '../../../../../shared/data/form-control';

@Component({
  selector: 'app-validation-form',
  imports: [FormsModule, ReactiveFormsModule, Select2Module, Card],
  templateUrl: './validation-form.html',
  styleUrl: './validation-form.scss',
})
export class ValidationForm {
  public selectTheme = selectTheme;
  public selectState = selectState;

  public validationForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    zip: new FormControl('', Validators.required),
    selectTheme: new FormControl('', Validators.required),
    selectFile: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    condition: new FormControl('', Validators.required),
  });

  submitForm() {
    this.validationForm.markAllAsTouched();
    if (this.validationForm.valid) {
      window.location.reload();
    }
  }
}
