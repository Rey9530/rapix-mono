import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { primaryStateCard } from '../../../../../shared/data/bonus-ui/creative-cards';

@Component({
  selector: 'app-border-primary-state',
  imports: [Card],
  templateUrl: './border-primary-state.html',
  styleUrl: './border-primary-state.scss',
})
export class BorderPrimaryState {
  public primaryStateCard = primaryStateCard;
}
