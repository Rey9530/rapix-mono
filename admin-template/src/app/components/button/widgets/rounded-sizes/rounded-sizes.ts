import { Component } from '@angular/core';

import { Card } from '../../../../shared/components/ui/card/card';
import { roundedSize } from '../../../../shared/data/buttons';

@Component({
  selector: 'app-rounded-sizes',
  imports: [Card],
  templateUrl: './rounded-sizes.html',
  styleUrl: './rounded-sizes.scss',
})
export class RoundedSizes {
  public roundedSize = roundedSize;
}
