import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { bgColor } from '../../../../../shared/data/ui-kits/navigate-links';

@Component({
  selector: 'app-background-color-opacity',
  imports: [Card],
  templateUrl: './background-color-opacity.html',
  styleUrl: './background-color-opacity.scss',
})
export class BackgroundColorOpacity {
  public bgColor = bgColor;
}
