import { Component } from '@angular/core';

import { Card } from '../../../../shared/components/ui/card/card';
import { buttonSize } from '../../../../shared/data/buttons';

@Component({
  selector: 'app-button-sizes',
  imports: [Card],
  templateUrl: './button-sizes.html',
  styleUrl: './button-sizes.scss',
})
export class ButtonSizes {
  public buttonSize = buttonSize;
}
