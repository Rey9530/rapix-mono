import { Component } from '@angular/core';

import { NumberingWizard } from './numbering-wizard/numbering-wizard';
import { ShippingForm } from './shipping-form/shipping-form';
import { StudentValidationForm } from './student-validation-form/student-validation-form';
import { VerticalValidationWizard } from './vertical-validation-wizard/vertical-validation-wizard';

@Component({
  selector: 'app-form-wizard1',
  imports: [
    NumberingWizard,
    StudentValidationForm,
    VerticalValidationWizard,
    ShippingForm,
  ],
  templateUrl: './form-wizard1.html',
  styleUrl: './form-wizard1.scss',
})
export class FormWizard1 {}
