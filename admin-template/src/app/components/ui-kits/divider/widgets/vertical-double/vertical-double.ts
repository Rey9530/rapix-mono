import { TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';
import { verticalDoubleDivider } from '../../../../../shared/data/ui-kits/divider';

@Component({
  selector: 'app-vertical-double',
  imports: [TitleCasePipe, Card, SvgIcon, TitleCasePipe],
  templateUrl: './vertical-double.html',
  styleUrl: './vertical-double.scss',
})
export class VerticalDouble {
  public verticalDoubleDivider = verticalDoubleDivider;
}
