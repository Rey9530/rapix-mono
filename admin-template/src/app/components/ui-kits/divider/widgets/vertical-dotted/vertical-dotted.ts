import { TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';
import { verticalDottedDivider } from '../../../../../shared/data/ui-kits/divider';

@Component({
  selector: 'app-vertical-dotted',
  imports: [TitleCasePipe, Card, SvgIcon, TitleCasePipe],
  templateUrl: './vertical-dotted.html',
  styleUrl: './vertical-dotted.scss',
})
export class VerticalDotted {
  public verticalDottedDivider = verticalDottedDivider;
}
