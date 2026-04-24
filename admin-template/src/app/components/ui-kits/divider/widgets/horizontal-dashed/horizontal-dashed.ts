import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { horizontalDashedDivider } from '../../../../../shared/data/ui-kits/divider';

@Component({
  selector: 'app-horizontal-dashed',
  imports: [Card],
  templateUrl: './horizontal-dashed.html',
  styleUrl: './horizontal-dashed.scss',
})
export class HorizontalDashed {
  public horizontalDashedDivider = horizontalDashedDivider;
}
