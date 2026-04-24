import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { rightRibbons } from '../../../../../shared/data/bonus-ui/ribbons';

@Component({
  selector: 'app-right-ribbon',
  imports: [Card],
  templateUrl: './right-ribbon.html',
  styleUrl: './right-ribbon.scss',
})
export class RightRibbon {
  public rightRibbons = rightRibbons;
}
