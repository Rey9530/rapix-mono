import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { opacity } from '../../../../../shared/data/ui-kits/navigate-links';

@Component({
  selector: 'app-border-opacity',
  imports: [Card],
  templateUrl: './border-opacity.html',
  styleUrl: './border-opacity.scss',
})
export class BorderOpacity {
  public opacity = opacity;
}
