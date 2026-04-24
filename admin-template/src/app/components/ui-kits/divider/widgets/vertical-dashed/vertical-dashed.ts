import { TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';
import { verticalDashedDivider } from '../../../../../shared/data/ui-kits/divider';

@Component({
  selector: 'app-vertical-dashed',
  imports: [TitleCasePipe, Card, SvgIcon, TitleCasePipe],
  templateUrl: './vertical-dashed.html',
  styleUrl: './vertical-dashed.scss',
})
export class VerticalDashed {
  public verticalDashedDivider = verticalDashedDivider;
}
