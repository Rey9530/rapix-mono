import { Component, input } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { List } from '../../../../../shared/interface/bonus-ui/bonus-ui';

@Component({
  selector: 'app-info-card',
  imports: [Card],
  templateUrl: './info-card.html',
  styleUrl: './info-card.scss',
})
export class InfoCard {
  readonly details = input<List>();
}
