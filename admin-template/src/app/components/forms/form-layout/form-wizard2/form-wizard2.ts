import { Component } from '@angular/core';

import { BusinessHorizontalWizard } from './business-horizontal-wizard/business-horizontal-wizard';
import { BusinessVerticalWizard } from './business-vertical-wizard/business-vertical-wizard';
import { CustomHorizontalWizard } from './custom-horizontal-wizard/custom-horizontal-wizard';
import { CustomVerticalWizard } from './custom-vertical-wizard/custom-vertical-wizard';

@Component({
  selector: 'app-form-wizard2',
  imports: [
    BusinessVerticalWizard,
    CustomVerticalWizard,
    BusinessHorizontalWizard,
    CustomHorizontalWizard,
  ],
  templateUrl: './form-wizard2.html',
  styleUrl: './form-wizard2.scss',
})
export class FormWizard2 {}
