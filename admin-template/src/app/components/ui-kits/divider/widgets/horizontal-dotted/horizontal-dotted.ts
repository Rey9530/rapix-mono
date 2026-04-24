import { TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { horizontalDottedDivider } from '../../../../../shared/data/ui-kits/divider';

@Component({
  selector: 'app-horizontal-dotted',
  imports: [TitleCasePipe, Card],
  templateUrl: './horizontal-dotted.html',
  styleUrl: './horizontal-dotted.scss',
})
export class HorizontalDotted {
  public horizontalDottedDivider = horizontalDottedDivider;
}
