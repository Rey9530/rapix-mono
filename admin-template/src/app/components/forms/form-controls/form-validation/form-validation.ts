import { Component } from '@angular/core';

import { BrowserDefault } from './browser-default/browser-default';
import { FormPasswordValidation } from './form-password-validation/form-password-validation';
import { FormValidationEffect } from './form-validation-effect/form-validation-effect';
import { TooltipFormValidation } from './tooltip-form-validation/tooltip-form-validation';
import { ValidationForm } from './validation-form/validation-form';

@Component({
  selector: 'app-form-validation',
  imports: [
    TooltipFormValidation,
    BrowserDefault,
    ValidationForm,
    FormValidationEffect,
    FormPasswordValidation,
  ],
  templateUrl: './form-validation.html',
  styleUrl: './form-validation.scss',
})
export class FormValidation {}
