import { TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';
import { colorsTwo } from '../../../../../shared/data/ui-kits/helper-classes';

@Component({
  selector: 'app-close-badge',
  imports: [TitleCasePipe, Card, FeatherIcon],
  templateUrl: './close-badge.html',
  styleUrl: './close-badge.scss',
})
export class CloseBadge {
  public colors = colorsTwo;
}
