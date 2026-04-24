import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { secondaryStateCard } from '../../../../../shared/data/bonus-ui/creative-cards';

@Component({
  selector: 'app-border-secondary-state',
  imports: [Card],
  templateUrl: './border-secondary-state.html',
  styleUrl: './border-secondary-state.scss',
})
export class BorderSecondaryState {
  public secondaryStateCard = secondaryStateCard;
}
