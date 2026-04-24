import { Component, input, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { businessSettings } from '../../../../../../../shared/data/form-widgets';

@Component({
  selector: 'app-business-setting',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './business-setting.html',
  styleUrl: './business-setting.scss',
})
export class BusinessSetting {
  readonly active = input<number>(0);

  readonly changeTab = output<number>();

  public businessSettings = businessSettings;
  public validate = false;

  public formValidation = new FormGroup({
    account_name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
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
