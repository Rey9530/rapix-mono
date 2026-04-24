import { Component } from '@angular/core';

import { Card } from '../../../../shared/components/ui/card/card';
import { roundedSize } from '../../../../shared/data/buttons';

@Component({
  selector: 'app-outline-rounded-sizes',
  imports: [Card],
  templateUrl: './outline-rounded-sizes.html',
  styleUrl: './outline-rounded-sizes.scss',
})
export class OutlineRoundedSizes {
  public roundedSize = roundedSize;
}
