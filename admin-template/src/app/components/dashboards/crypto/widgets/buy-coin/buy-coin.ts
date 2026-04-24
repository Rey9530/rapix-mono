import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions7 } from '../../../../../shared/data/common';
import { currencyOptions } from '../../../../../shared/data/dashboard/crypto';

@Component({
  selector: 'app-buy-coin',
  imports: [Card],
  templateUrl: './buy-coin.html',
  styleUrl: './buy-coin.scss',
})
export class BuyCoin {
  public cardToggleOption = cardToggleOptions7;
  public currencyOptions = currencyOptions;
}
