import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { imageBadge } from '../../../../../shared/data/ui-kits/badge';

@Component({
  selector: 'app-image-badge',
  imports: [Card],
  templateUrl: './image-badge.html',
  styleUrl: './image-badge.scss',
})
export class ImageBadge {
  public imageBadge = imageBadge;
}
