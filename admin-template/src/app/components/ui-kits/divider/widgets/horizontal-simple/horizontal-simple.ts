import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { simpleDivider } from '../../../../../shared/data/ui-kits/divider';

@Component({
  selector: 'app-horizontal-simple',
  imports: [Card],
  templateUrl: './horizontal-simple.html',
  styleUrl: './horizontal-simple.scss',
})
export class HorizontalSimple {
  public simpleDivider = simpleDivider;
}
