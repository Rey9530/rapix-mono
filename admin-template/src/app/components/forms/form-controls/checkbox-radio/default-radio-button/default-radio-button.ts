import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { defaultRadio } from '../../../../../shared/data/form-control';

@Component({
  selector: 'app-default-radio-button',
  imports: [Card],
  templateUrl: './default-radio-button.html',
  styleUrl: './default-radio-button.scss',
})
export class DefaultRadioButton {
  public defaultRadio = defaultRadio;
}
