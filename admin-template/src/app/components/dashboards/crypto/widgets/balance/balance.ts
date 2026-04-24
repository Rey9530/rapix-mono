import { DecimalPipe, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';
import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';
import { balanceDetails } from '../../../../../shared/data/dashboard/crypto';

@Component({
  selector: 'app-balance',
  imports: [RouterModule, Card, FeatherIcon, SvgIcon, DecimalPipe, NgClass],
  templateUrl: './balance.html',
  styleUrl: './balance.scss',
})
export class Balance {
  public balanceDetails = balanceDetails;
}
