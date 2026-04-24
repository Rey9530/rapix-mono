import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { simpleDivider } from '../../../../../shared/data/ui-kits/divider';

@Component({
  selector: 'app-vertical-simple',
  imports: [Card],
  templateUrl: './vertical-simple.html',
  styleUrl: './vertical-simple.scss',
})
export class VerticalSimple {
  public simpleDivider = simpleDivider;
}
