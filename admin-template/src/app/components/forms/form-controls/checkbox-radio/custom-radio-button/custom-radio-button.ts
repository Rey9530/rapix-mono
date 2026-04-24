import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import {
  borderedRadio,
  filledRadio,
  iconsRadio,
} from '../../../../../shared/data/form-control';

@Component({
  selector: 'app-custom-radio-button',
  imports: [Card],
  templateUrl: './custom-radio-button.html',
  styleUrl: './custom-radio-button.scss',
})
export class CustomRadioButton {
  public borderedRadio = borderedRadio;
  public iconsRadio = iconsRadio;
  public filledRadio = filledRadio;
}
