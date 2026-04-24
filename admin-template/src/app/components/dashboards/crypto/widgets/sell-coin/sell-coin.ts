import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions7 } from '../../../../../shared/data/common';
import { currencyOptions } from '../../../../../shared/data/dashboard/crypto';

@Component({
  selector: 'app-sell-coin',
  imports: [Card],
  templateUrl: './sell-coin.html',
  styleUrl: './sell-coin.scss',
})
export class SellCoin {
  public cardToggleOption = cardToggleOptions7;
  public currencyOptions = currencyOptions;
}
