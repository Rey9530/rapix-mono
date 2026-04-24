import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import {
  borderPosition,
  colorsTwo,
} from '../../../../../shared/data/ui-kits/helper-classes';

@Component({
  selector: 'app-border-position',
  imports: [Card],
  templateUrl: './border-position.html',
  styleUrl: './border-position.scss',
})
export class BorderPosition {
  public colors = colorsTwo;
  public borderPosition = borderPosition;
}
