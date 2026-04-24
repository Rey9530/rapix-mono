import { Component } from '@angular/core';

import { CustomHorizontalWizard } from '../custom-horizontal-wizard/custom-horizontal-wizard';

@Component({
  selector: 'app-custom-vertical-wizard',
  imports: [CustomHorizontalWizard],
  templateUrl: './custom-vertical-wizard.html',
  styleUrl: './custom-vertical-wizard.scss',
})
export class CustomVerticalWizard {}
