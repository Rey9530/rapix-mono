import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { imageSize } from '../../../../../shared/data/ui-kits/helper-classes';

@Component({
  selector: 'app-image-size',
  imports: [Card],
  templateUrl: './image-size.html',
  styleUrl: './image-size.scss',
})
export class ImageSize {
  public imageSize = imageSize;
}
