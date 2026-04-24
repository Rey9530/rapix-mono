import { Component } from '@angular/core';

import { BusinessVerticalWizard } from '../business-vertical-wizard/business-vertical-wizard';

@Component({
  selector: 'app-business-horizontal-wizard',
  imports: [BusinessVerticalWizard],
  templateUrl: './business-horizontal-wizard.html',
  styleUrl: './business-horizontal-wizard.scss',
})
export class BusinessHorizontalWizard {}
