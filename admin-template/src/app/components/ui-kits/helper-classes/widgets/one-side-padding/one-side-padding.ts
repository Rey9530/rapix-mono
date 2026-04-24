import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import {
  oneSidePadding,
  values,
} from '../../../../../shared/data/ui-kits/helper-classes';

@Component({
  selector: 'app-one-side-padding',
  imports: [Card],
  templateUrl: './one-side-padding.html',
  styleUrl: './one-side-padding.scss',
})
export class OneSidePadding {
  public oneSidePadding = oneSidePadding;
  public paddings = values;
}
