import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { leftRibbons } from '../../../../../shared/data/bonus-ui/ribbons';

@Component({
  selector: 'app-left-ribbon',
  imports: [Card],
  templateUrl: './left-ribbon.html',
  styleUrl: './left-ribbon.scss',
})
export class LeftRibbon {
  public leftRibbons = leftRibbons;
}
