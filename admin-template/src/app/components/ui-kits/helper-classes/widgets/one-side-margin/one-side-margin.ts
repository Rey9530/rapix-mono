import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import {
  oneSideMargin,
  values,
} from '../../../../../shared/data/ui-kits/helper-classes';

@Component({
  selector: 'app-one-side-margin',
  imports: [Card],
  templateUrl: './one-side-margin.html',
  styleUrl: './one-side-margin.scss',
})
export class OneSideMargin {
  public oneSideMargin = oneSideMargin;
  public margins = values;
}
