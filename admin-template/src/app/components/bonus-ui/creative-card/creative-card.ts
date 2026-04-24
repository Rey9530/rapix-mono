import { Component } from '@angular/core';

import { AbsoluteCard } from './widgets/absolute-card/absolute-card';
import { BorderBottomCard } from './widgets/border-bottom-card/border-bottom-card';
import { BorderLeftCard } from './widgets/border-left-card/border-left-card';
import { BorderPrimaryState } from './widgets/border-primary-state/border-primary-state';
import { BorderRightCard } from './widgets/border-right-card/border-right-card';
import { BorderSecondaryState } from './widgets/border-secondary-state/border-secondary-state';
import { BorderTopCard } from './widgets/border-top-card/border-top-card';
import { BorderWarningState } from './widgets/border-warning-state/border-warning-state';
import { TitleCard1 } from './widgets/title-card-1/title-card-1';
import { TitleCard2 } from './widgets/title-card-2/title-card-2';
import { TitleCard3 } from './widgets/title-card-3/title-card-3';
import { absoluteCards } from '../../../shared/data/bonus-ui/creative-cards';

@Component({
  selector: 'app-creative-card',
  imports: [
    TitleCard1,
    TitleCard2,
    TitleCard3,
    BorderLeftCard,
    BorderRightCard,
    BorderTopCard,
    BorderBottomCard,
    BorderPrimaryState,
    BorderWarningState,
    BorderSecondaryState,
    AbsoluteCard,
  ],
  templateUrl: './creative-card.html',
  styleUrl: './creative-card.scss',
})
export class CreativeCard {
  public absoluteCards = absoluteCards;
}
