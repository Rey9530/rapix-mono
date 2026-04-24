import { Component } from '@angular/core';

import { Card } from '../../../../shared/components/ui/card/card';
import { buttonSize } from '../../../../shared/data/buttons';

@Component({
  selector: 'app-outline-button-sizes',
  imports: [Card],
  templateUrl: './outline-button-sizes.html',
  styleUrl: './outline-button-sizes.scss',
})
export class OutlineButtonSizes {
  public buttonSize = buttonSize;
}
