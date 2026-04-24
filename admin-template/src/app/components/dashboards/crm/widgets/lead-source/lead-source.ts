import { Component } from '@angular/core';

import { CardDropdownButton } from '../../../../../shared/components/ui/card/card-dropdown-button/card-dropdown-button';
import { cardToggleOptions5 } from '../../../../../shared/data/common';
import { leadSource } from '../../../../../shared/data/dashboard/crm';

@Component({
  selector: 'app-lead-source',
  imports: [CardDropdownButton],
  templateUrl: './lead-source.html',
  styleUrl: './lead-source.scss',
})
export class LeadSource {
  public leadSource = leadSource;
  public cardToggleOption = cardToggleOptions5;
}
