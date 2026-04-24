import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { warningStateCard } from '../../../../../shared/data/bonus-ui/creative-cards';

@Component({
  selector: 'app-border-warning-state',
  imports: [Card],
  templateUrl: './border-warning-state.html',
  styleUrl: './border-warning-state.scss',
})
export class BorderWarningState {
  public warningStateCard = warningStateCard;
}
