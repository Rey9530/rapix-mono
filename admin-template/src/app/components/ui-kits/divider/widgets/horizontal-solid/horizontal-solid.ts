import { TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { horizontalSolidDivider } from '../../../../../shared/data/ui-kits/divider';

@Component({
  selector: 'app-horizontal-solid',
  imports: [TitleCasePipe, Card],
  templateUrl: './horizontal-solid.html',
  styleUrl: './horizontal-solid.scss',
})
export class HorizontalSolid {
  public horizontalSolidDivider = horizontalSolidDivider;
}
