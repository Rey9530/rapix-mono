import { Component } from '@angular/core';

import { BadgeHeading } from './widgets/badge-heading/badge-heading';
import { ButtonBadge } from './widgets/button-badge/button-badge';
import { CloseBadge } from './widgets/close-badge/close-badge';
import { ImageBadge } from './widgets/image-badge/image-badge';
import { ImageCloseBadge } from './widgets/image-close-badge/image-close-badge';
import { PositionedBadge } from './widgets/positioned-badge/positioned-badge';
import { VariationBadge } from './widgets/variation-badge/variation-badge';
import { Card } from '../../../shared/components/ui/card/card';
import { badgeIcons } from '../../../shared/data/ui-kits/badge';
import { colorsTwo } from '../../../shared/data/ui-kits/helper-classes';

@Component({
  selector: 'app-tag-pills',
  imports: [
    Card,
    VariationBadge,
    BadgeHeading,
    PositionedBadge,
    ButtonBadge,
    ImageBadge,
    CloseBadge,
    ImageCloseBadge,
  ],
  templateUrl: './tag-pills.html',
  styleUrl: './tag-pills.scss',
})
export class TagPills {
  public badgeColors = colorsTwo;
  public badgeIcons = badgeIcons;
}
