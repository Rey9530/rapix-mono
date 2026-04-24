import { Component, input } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { IAbsoluteCard } from '../../../../../shared/interface/bonus-ui/bonus-ui';

@Component({
  selector: 'app-absolute-card',
  imports: [Card],
  templateUrl: './absolute-card.html',
  styleUrl: './absolute-card.scss',
})
export class AbsoluteCard {
  readonly details = input<IAbsoluteCard>();
}
