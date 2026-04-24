import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { CardDropdownButton } from '../../../../../shared/components/ui/card/card-dropdown-button/card-dropdown-button';
import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';
import { cardToggleOptions1 } from '../../../../../shared/data/common';
import { ILastMonthDetails } from '../../../../../shared/interface/widgets/general';

@Component({
  selector: 'app-last-month-details',
  imports: [SvgIcon, CardDropdownButton, DecimalPipe],
  templateUrl: './last-month-details.html',
  styleUrl: './last-month-details.scss',
})
export class LastMonthDetails {
  readonly details = input<ILastMonthDetails>();

  public cardToggleOption = cardToggleOptions1;
}
