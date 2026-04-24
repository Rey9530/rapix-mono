import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';
import { imageBadge } from '../../../../../shared/data/ui-kits/badge';

@Component({
  selector: 'app-image-close-badge',
  imports: [Card, FeatherIcon],
  templateUrl: './image-close-badge.html',
  styleUrl: './image-close-badge.scss',
})
export class ImageCloseBadge {
  public imageBadge = imageBadge;
}
