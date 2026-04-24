import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';
import { variationRadio } from '../../../../../shared/data/form-control';

@Component({
  selector: 'app-variation-radio',
  imports: [Card, SvgIcon],
  templateUrl: './variation-radio.html',
  styleUrl: './variation-radio.scss',
})
export class VariationRadio {
  public variationRadio = variationRadio;
}
